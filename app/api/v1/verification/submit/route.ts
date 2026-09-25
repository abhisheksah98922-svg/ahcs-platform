import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/sessions';
import { db } from '@/lib/db/store';
import { hashDocumentNumber, evaluateDuplicateProbability } from '@/lib/duplicate-detector';
import { sendApplicationReceivedEmail } from '@/lib/email/mailer';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    const account = db.findAccountByUserId(auth.user.id);
    const profile = account ? db.findProfileByAccountId(account.id) : null;

    if (!account || !profile) {
      return NextResponse.json(
        { success: false, error: 'Please complete your profile before submitting verification documents' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const docType = body.docType || body.documentType;
    const docNumber = body.docNumber || body.documentNumber;
    const fileName = body.fileName || body.s3ObjectKey;
    const fileSizeBytes = body.fileSizeBytes;

    if (!docType || !docNumber) {
      return NextResponse.json(
        { success: false, error: 'Document type and document reference number are required' },
        { status: 400 }
      );
    }

    // 1. Hash document number for indexed duplicate detection
    const docHash = hashDocumentNumber(docType, docNumber);
    const maskedNumber = docNumber.length > 4 
      ? `XXXX-XXXX-${docNumber.slice(-4)}` 
      : `XXXX-${docNumber}`;

    // 2. Fetch all existing active candidate profiles for duplicate scoring
    const allProfiles = db.getAllProfiles().filter(p => p.accountId !== account.id);
    const allDocs = db.getAllVerificationDocuments();

    const candidates = allProfiles.map(p => {
      const pDoc = allDocs.find(d => d.documentNumberHash === docHash);
      const pUser = db.findUserById(db.findAccountById(p.accountId)?.userId || '');
      return {
        id: p.id,
        accountId: p.accountId,
        fullName: p.fullName,
        dateOfBirth: p.dateOfBirth,
        mobileNumber: pUser?.mobileNumber || '',
        email: pUser?.email || undefined,
        documentNumberHash: pDoc?.documentNumberHash || '',
        district: p.district,
      };
    });

    // 3. Execute Duplicate Detection Scoring
    const dupCheck = evaluateDuplicateProbability(
      {
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth,
        mobileNumber: auth.user.mobileNumber,
        email: auth.user.email || undefined,
        documentType: docType,
        documentNumber: docNumber,
        district: profile.district,
      },
      candidates
    );

    // 4. Create or Update Verification Request in DB
    const verifRequest = db.createOrUpdateVerificationRequest(account.id, {
      status: 'SUBMITTED',
      duplicateCheckResult: dupCheck.status,
      duplicateScore: dupCheck.score,
      duplicateMatchDetails: {
        matchedFields: dupCheck.matchedFields,
        candidateId: dupCheck.candidateId,
      },
      assignedOfficerId: 'usr_officer_ananya_01', // Automatically assign to duty officer queue
    });

    // 5. Store Verification Document Record
    const verifDoc = db.addVerificationDocument({
      verificationRequestId: verifRequest.id,
      documentType: docType,
      documentNumberHash: docHash,
      documentNumberMasked: maskedNumber,
      s3ObjectKey: `vault/documents/${account.id}/${Date.now()}_${fileName || 'doc.pdf'}`,
      fileMimeType: 'application/pdf',
      fileSizeBytes: fileSizeBytes || 1024 * 500,
      status: 'PENDING',
      verificationNotes: null,
      verifiedBy: null,
      verifiedAt: null,
    });

    // 6. Update Account State
    db.updateAccountState(account.id, 'VERIFICATION_PENDING');

    // 7. Audit Log
    db.logAudit({
      actorId: auth.user.id,
      actorRole: auth.user.role,
      action: 'DOCUMENT_UPLOADED',
      targetResource: 'VERIFICATION_DOCUMENT',
      targetId: verifDoc.id,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      metadata: {
        docType,
        duplicateResult: dupCheck.status,
        duplicateScore: dupCheck.score,
      },
    });

    // 8. Dispatch Real Confirmation Email to Citizen via Gmail SMTP
    if (auth.user.email) {
      sendApplicationReceivedEmail(auth.user.email, {
        fullName: profile.fullName,
        requestId: verifRequest.id,
        docType: docType,
      }).catch(err => console.error('[EMAIL_SUBMIT_NOTICE]', err));
    }

    return NextResponse.json({
      success: true,
      verificationRequestId: verifRequest.id,
      duplicateCheck: dupCheck,
      documentId: verifDoc.id,
    });
  } catch (err: any) {
    console.error('Verification Submit Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error submitting verification' },
      { status: 500 }
    );
  }
}
