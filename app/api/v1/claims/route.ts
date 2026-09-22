import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    // Provider staff view
    if (providerId && ['DOCTOR', 'PROVIDER_ADMIN', 'ADMIN'].includes(user.role)) {
      const claims = db.getClaimsForProvider(providerId);
      return NextResponse.json({ success: true, count: claims.length, claims });
    }

    // Patient view
    if (account) {
      const claims = db.getClaimsForAccount(account.id);
      return NextResponse.json({ success: true, count: claims.length, claims });
    }

    return NextResponse.json({ error: 'Unauthorized query' }, { status: 403 });
  } catch (error: any) {
    console.error('Error fetching claims:', error);
    return NextResponse.json({ error: 'Failed to retrieve claims' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account, clientId } = context;
    if (!['DOCTOR', 'PROVIDER_ADMIN', 'ADMIN', 'VERIFICATION_OFFICER', 'CITIZEN', 'PATIENT'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Unauthorized to submit claims' }, { status: 403 });
    }

    const body = await request.json();
    const {
      providerId,
      patientClientId,
      serviceDate,
      invoiceDate,
      serviceType,
      serviceCategory,
      totalBillPaise,
      claimedAmountPaise,
      claimedAmount,
      invoiceNumber,
      notes,
    } = body;

    const finalServiceDate = serviceDate || invoiceDate || new Date().toISOString().split('T')[0];
    const finalServiceType = serviceType || serviceCategory || 'INPATIENT_SURGERY';
    const finalClaimedAmountPaise =
      claimedAmountPaise !== undefined
        ? claimedAmountPaise
        : claimedAmount !== undefined
        ? claimedAmount * 100
        : totalBillPaise;
    const finalTotalBillPaise =
      totalBillPaise !== undefined ? totalBillPaise : finalClaimedAmountPaise;

    if (!providerId) {
      return NextResponse.json(
        { error: 'Missing required claim parameters: providerId is required' },
        { status: 400 }
      );
    }

    let targetAccountId = account?.id;
    if (patientClientId) {
      const targetClient = db.findClientId(patientClientId);
      if (!targetClient) {
        return NextResponse.json({ error: `Invalid Patient Client ID ${patientClientId}` }, { status: 404 });
      }
      targetAccountId = targetClient.accountId;
    }

    if (!targetAccountId) {
      return NextResponse.json({ error: 'Patient account required' }, { status: 400 });
    }

    const provider = db.getProviderById(providerId);
    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Check duplicate invoiceNumber for this provider
    if (invoiceNumber) {
      const providerClaims = db.getClaimsForProvider(providerId);
      const duplicate = providerClaims.find(
        (c: any) => c.invoiceNumber === invoiceNumber || c.claimNumber === invoiceNumber
      );
      if (duplicate) {
        return NextResponse.json(
          { error: `Conflict: duplicate invoice number ${invoiceNumber} detected for provider ${provider.name}` },
          { status: 409 }
        );
      }
    }

    const claimNumber = invoiceNumber || `CLM-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const claim = db.createClaim({
      providerId,
      providerName: provider.name,
      accountId: targetAccountId,
      claimNumber,
      serviceDate: finalServiceDate,
      serviceType: finalServiceType,
      totalBillPaise: finalTotalBillPaise,
      claimedAmountPaise: finalClaimedAmountPaise,
      status: 'SUBMITTED',
      notes,
    });

    (claim as any).invoiceNumber = invoiceNumber || claimNumber;

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'CLAIM_SUBMITTED',
      targetResource: 'claims',
      targetId: claim.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { claimNumber, claimedAmountPaise },
    });

    return NextResponse.json({
      success: true,
      message: 'Claim successfully submitted and queued for verification',
      claim,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting claim:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit claim' },
      { status: 400 }
    );
  }
}
