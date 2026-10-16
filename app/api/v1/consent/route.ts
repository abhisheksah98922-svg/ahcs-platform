import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { ConsentPurpose, ConsentScope, ConsentStatus } from '@/lib/db/types';
import { validateClientIdChecksum } from '@/lib/client-id';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    // If providerId query param provided, verify caller is provider/admin
    if (providerId) {
      const isClinicianOrAdmin = ['DOCTOR', 'PROVIDER_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(context.user.role);
      if (!isClinicianOrAdmin) {
        return NextResponse.json({
          error: 'Access forbidden: Only healthcare providers and administrators may query provider consent records',
        }, { status: 403 });
      }

      const consents = db.getConsentsForProvider(providerId);
      return NextResponse.json({ success: true, consents });
    }

    // Otherwise, retrieve for logged in patient
    const account = context.account;
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const consents = db.getConsentsForAccount(account.id);
    return NextResponse.json({
      success: true,
      accountId: account.id,
      consents,
    });
  } catch (error: any) {
    console.error('Error fetching consents:', error);
    return NextResponse.json({ error: 'Failed to retrieve consents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 1: Doctor requests consent from patient
    if (action === 'REQUEST') {
      const context = await getCurrentUser();
      if (!context || !context.user) {
        return NextResponse.json({ error: 'Authentication required to request clinical consent' }, { status: 401 });
      }

      const isClinicianOrAdmin = ['DOCTOR', 'PROVIDER_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(context.user.role);
      if (!isClinicianOrAdmin) {
        return NextResponse.json({
          error: 'Access forbidden: Only verified doctors or healthcare providers may request patient consent',
        }, { status: 403 });
      }

      const {
        clientId,
        accountId: directAccountId,
        providerId,
        providerName,
        doctorName,
        purpose,
        scope,
      } = body;

      let targetAccountId = directAccountId;

      if (!targetAccountId && clientId) {
        if (!validateClientIdChecksum(clientId)) {
          return NextResponse.json({ error: 'Invalid AHCS Client ID checksum' }, { status: 400 });
        }
        const clientRec = db.findClientId(clientId);
        if (!clientRec || !clientRec.isActive) {
          return NextResponse.json({ error: 'Client ID not found or inactive' }, { status: 404 });
        }
        targetAccountId = clientRec.accountId;
      }

      if (!targetAccountId || !providerId || !providerName || !doctorName) {
        return NextResponse.json({ error: 'Missing required parameters for consent request' }, { status: 400 });
      }

      // Check if active consent already exists
      if (db.hasActiveConsent(targetAccountId, providerId)) {
        return NextResponse.json({
          success: true,
          message: 'Active valid consent already exists for this provider.',
          alreadyActive: true,
        });
      }

      const consent = db.createConsentRequest({
        accountId: targetAccountId,
        providerId,
        providerName,
        doctorName,
        purpose: (purpose as ConsentPurpose) || 'GENERAL_CONSULTATION',
        scope: (scope as ConsentScope) || 'ALL_RECORDS',
        status: 'REQUESTED',
        requestedAt: new Date().toISOString(),
      });

      db.logAudit({
        actorId: context.user.id,
        actorRole: context.user.role,
        action: 'CONSENT_REQUESTED',
        targetResource: 'consents',
        targetId: consent.id,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: {
          consentId: consent.id,
          providerId,
          doctorName,
          purpose: consent.purpose,
          scope: consent.scope,
          targetAccountId,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Consent request dispatched to patient.',
        consent,
      }, { status: 201 });
    }

    // Action 2: Patient responds (Grants or Rejects)
    if (action === 'RESPOND') {
      const context = await getCurrentUser();
      if (!context || !context.user) {
        return NextResponse.json({ error: 'Authentication required to approve or deny consent' }, { status: 401 });
      }

      const { user, account } = context;
      if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }

      const { consentId, decision, durationHours = 24 } = body;
      if (!consentId || !decision) {
        return NextResponse.json({ error: 'Missing consentId or decision' }, { status: 400 });
      }

      const existing = db.getConsentById(consentId);
      if (!existing || existing.accountId !== account.id) {
        return NextResponse.json({ error: 'Consent request not found or does not belong to your account' }, { status: 404 });
      }

      const newStatus: ConsentStatus = decision === 'GRANT' || decision === 'APPROVE' ? 'GRANTED' : 'REJECTED';
      const updated = db.respondToConsent(consentId, newStatus, durationHours);

      db.logAudit({
        actorId: user.id,
        actorRole: user.role,
        action: `CONSENT_${newStatus}`,
        targetResource: 'consents',
        targetId: consentId,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: {
          consentId,
          decision: newStatus,
          providerId: existing.providerId,
          durationHours: newStatus === 'GRANTED' ? durationHours : 0,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Consent ${newStatus === 'GRANTED' ? 'granted for ' + durationHours + ' hours' : 'rejected'}.`,
        consent: updated,
      });
    }

    return NextResponse.json({ error: 'Invalid action. Must be REQUEST or RESPOND' }, { status: 400 });
  } catch (error: any) {
    console.error('Error handling consent action:', error);
    return NextResponse.json({ error: 'Failed to process consent request' }, { status: 500 });
  }
}
