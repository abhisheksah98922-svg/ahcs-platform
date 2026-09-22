import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const body = await request.json();
    const { consentId } = body;

    if (!consentId) {
      return NextResponse.json({ error: 'Missing consentId' }, { status: 400 });
    }

    const consent = db.getConsentById(consentId);
    if (!consent || consent.accountId !== account.id) {
      return NextResponse.json({ error: 'Consent not found or unauthorized' }, { status: 404 });
    }

    const revoked = db.revokeConsent(consentId);

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'CONSENT_REVOKED',
      targetResource: 'consents',
      targetId: consentId,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        consentId,
        providerId: consent.providerId,
        revokedAt: revoked?.revokedAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Provider access immediately revoked. Any open clinical query sessions for this provider have been terminated.',
      consent: revoked,
    });
  } catch (error: any) {
    console.error('Error revoking consent:', error);
    return NextResponse.json({ error: 'Failed to revoke consent' }, { status: 500 });
  }
}
