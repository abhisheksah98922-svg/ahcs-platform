import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth/sessions';
import { db } from '@/lib/db/store';
import { generateAhcsClientId } from '@/lib/client-id';
import { generateSecureAccessToken, generateCardActivationCode } from '@/lib/tokens';
import { sendApplicationApprovedEmail, sendApplicationRejectedEmail } from '@/lib/email/mailer';

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();

    // Verify officer privileges
    const isOfficer = auth && (auth.user.role === 'VERIFICATION_OFFICER' || auth.user.role === 'SUPER_ADMIN');
    if (!isOfficer) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN: Only authorized verification officers can approve or reject profiles' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { verificationRequestId, decision, notes } = body;

    if (!verificationRequestId || !['APPROVE', 'REJECT', 'REQUEST_CORRECTION'].includes(decision)) {
      return NextResponse.json(
        { success: false, error: 'Invalid decision payload. Expected APPROVE, REJECT, or REQUEST_CORRECTION' },
        { status: 400 }
      );
    }

    const verifReq = db.findVerificationRequestById(verificationRequestId);
    if (!verifReq) {
      return NextResponse.json(
        { success: false, error: 'Verification request ticket not found' },
        { status: 404 }
      );
    }

    const account = db.findAccountById(verifReq.accountId);
    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Target account not found' },
        { status: 404 }
      );
    }

    // Process Decision
    if (decision === 'REJECT') {
      const finalReason = (body.rejectionReason || body.notes || notes || '').trim();
      if (!finalReason) {
        return NextResponse.json(
          { success: false, error: 'Mandatory rejection reason required. Please specify why the application cannot be approved.' },
          { status: 400 }
        );
      }

      verifReq.status = 'REJECTED';
      verifReq.reviewNotes = finalReason;
      verifReq.reviewedAt = new Date().toISOString();
      db.updateAccountState(account.id, 'REGISTERED');

      // 1. Dispatch In-App Notification to Citizen
      db.createNotification({
        userId: account.userId,
        title: 'KYC Verification Application Rejected',
        message: `Your AHCS KYC verification was not approved. Reason: "${finalReason}". Please update your details and re-submit valid documentation.`,
        category: 'SYSTEM',
        channel: 'IN_APP',
      });

      // 2. Dispatch real email to Citizen via Gmail SMTP
      const targetUser = db.findUserById(account.userId);
      const citizenProfile = db.findProfileByAccountId(account.id);
      if (targetUser?.email) {
        sendApplicationRejectedEmail(targetUser.email, {
          fullName: citizenProfile?.fullName || 'Applicant',
          reason: finalReason,
        }).catch(err => console.error('[EMAIL_REJECT_NOTICE]', err));
      }

      db.logAudit({
        actorId: auth.user.id,
        actorRole: auth.user.role,
        action: 'DOCUMENT_REJECTED',
        targetResource: 'VERIFICATION_REQUEST',
        targetId: verifReq.id,
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
        metadata: { rejectionReason: finalReason, recipientContact: targetUser?.email || targetUser?.mobileNumber || 'Citizen' },
      });

      return NextResponse.json({
        success: true,
        status: 'REJECTED',
        message: 'Application rejected. Detailed rejection notice dispatched to applicant.',
        rejectionReason: finalReason,
      });
    }

    if (decision === 'REQUEST_CORRECTION') {
      verifReq.status = 'RE_VERIFICATION_REQUIRED';
      verifReq.reviewNotes = notes || 'Correction required on submitted documents';
      verifReq.reviewedAt = new Date().toISOString();
      db.updateAccountState(account.id, 'CORRECTION_REQUIRED');

      db.logAudit({
        actorId: auth.user.id,
        actorRole: auth.user.role,
        action: 'CORRECTION_REQUESTED',
        targetResource: 'VERIFICATION_REQUEST',
        targetId: verifReq.id,
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
        metadata: { notes },
      });

      return NextResponse.json({ success: true, status: 'CORRECTION_REQUIRED' });
    }

    // --- APPROVAL WORKFLOW (ATOMIC ISSUANCE) ---
    // Rule: Duplicate check must not be CONFIRMED_DUPLICATE
    if (verifReq.duplicateCheckResult === 'CONFIRMED_DUPLICATE') {
      return NextResponse.json(
        { success: false, error: 'Cannot approve profile: Confirmed duplicate account detected' },
        { status: 409 }
      );
    }

    // 1. Mark verification as VERIFIED
    verifReq.status = 'VERIFIED';
    verifReq.reviewNotes = notes || 'Approved by verification officer';
    verifReq.reviewedAt = new Date().toISOString();

    // 2. Mark submitted documents verified
    const docs = db.getDocumentsByRequestId(verifReq.id);
    docs.forEach(doc => {
      doc.status = 'VERIFIED';
      doc.verifiedBy = auth.user.id;
      doc.verifiedAt = new Date().toISOString();
    });

    // 3. Mark Profile blood group source as DOCUMENT_VERIFIED
    const profile = db.findProfileByAccountId(account.id);
    if (profile) {
      profile.bloodGroupSource = 'DOCUMENT_VERIFIED';
    }

    // 4. Update account to APPROVED_FOR_ID_GENERATION
    db.updateAccountState(account.id, 'APPROVED_FOR_ID_GENERATION');

    // 5. Generate Permanent Client ID (Transactional generation)
    let clientIdRecord = db.findClientIdByAccountId(account.id);
    if (!clientIdRecord) {
      let attempts = 0;
      while (attempts < 5) {
        attempts++;
        const { clientId, checksum } = generateAhcsClientId('IN');
        try {
          clientIdRecord = db.createClientId(account.id, clientId, checksum);
          break;
        } catch (e) {
          // Retry on collision
        }
      }
      if (!clientIdRecord) {
        throw new Error('Failed to mint unique Client ID after multiple attempts');
      }
    }

    // 6. Generate Health Card in PENDING_ACTIVATION
    let card = db.findCardByAccountId(account.id);
    let rawActivationCode = '';
    let tokenRaw = '';

    if (!card) {
      const { code, codeHash } = generateCardActivationCode();
      rawActivationCode = code;
      const cardNumber = `CRD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

      card = db.createCard({
        clientIdFk: clientIdRecord.id,
        accountId: account.id,
        cardNumber,
        version: 1,
        status: 'PENDING_ACTIVATION',
        activationCodeHash: codeHash,
        activatedAt: null,
        activatedByUserId: null,
        expiresAt: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 5-year validity
      });

      // 7. Mint Dynamic 256-bit QR Token
      tokenRaw = generateSecureAccessToken();
      const tokenHash = crypto.createHash('sha256').update(tokenRaw).digest('hex');

      db.createQrToken({
        cardId: card.id,
        tokenHash,
        tokenRaw,
        tokenType: 'EMERGENCY_QR',
        isRevoked: false,
        scanCount: 0,
        lastScannedAt: null,
        expiresAt: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // 8. Log Audit Records
    db.logAudit({
      actorId: auth.user.id,
      actorRole: auth.user.role,
      action: 'PROFILE_APPROVED',
      targetResource: 'ACCOUNT',
      targetId: account.id,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      metadata: { clientId: clientIdRecord.clientId, cardNumber: card.cardNumber },
    });

    db.logAudit({
      actorId: auth.user.id,
      actorRole: auth.user.role,
      action: 'CLIENT_ID_GENERATED',
      targetResource: 'CLIENT_ID',
      targetId: clientIdRecord.id,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      metadata: { clientId: clientIdRecord.clientId },
    });

    // 9. Dispatch Real Approval Email to Citizen via Gmail SMTP
    const targetUser = db.findUserById(account.userId);
    const citizenProfile = db.findProfileByAccountId(account.id);
    if (targetUser?.email) {
      sendApplicationApprovedEmail(targetUser.email, {
        fullName: citizenProfile?.fullName || 'Citizen',
        clientId: clientIdRecord.clientId,
        cardNumber: card.cardNumber,
      }).catch(err => console.error('[EMAIL_APPROVE_NOTICE]', err));
    }

    return NextResponse.json({
      success: true,
      status: 'APPROVED',
      clientId: clientIdRecord.clientId,
      card: {
        id: card.id,
        cardNumber: card.cardNumber,
        status: card.status,
      },
      qrToken: {
        token: tokenRaw,
      },
      activationCode: rawActivationCode || undefined, // Provided for testing delivery
    });
  } catch (err: any) {
    console.error('Officer Decision Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error processing officer decision' },
      { status: 500 }
    );
  }
}
