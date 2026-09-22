import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { ProviderStatus } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    const user = context?.user;
    if (!user || (user.role !== 'VERIFICATION_OFFICER' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Officer or Admin privileges required.' }, { status: 403 });
    }

    const body = await request.json();
    const { providerId, decision, reviewNotes } = body;

    if (!providerId || !decision) {
      return NextResponse.json({ error: 'Missing providerId or decision' }, { status: 400 });
    }

    const finalReason = (body.rejectionReason || body.reviewNotes || reviewNotes || '').trim();

    let newStatus: ProviderStatus;
    if (decision === 'REJECT') {
      if (!finalReason) {
        return NextResponse.json({ error: 'Mandatory rejection reason required for facility application rejection.' }, { status: 400 });
      }
      newStatus = 'REJECTED';
    } else if (decision === 'VERIFY' || decision === 'APPROVE') {
      newStatus = 'VERIFIED';
    } else if (decision === 'SUSPEND') {
      newStatus = 'SUSPENDED';
    } else {
      return NextResponse.json({ error: 'Invalid decision. Allowed: VERIFY, REJECT, SUSPEND' }, { status: 400 });
    }

    const updated = db.updateProviderStatus(providerId, newStatus, user.id);
    if (!updated) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    if (newStatus === 'REJECTED') {
      console.log(`[EMAIL_SERVICE] Dispatched Facility Application Rejection to ${updated.email}: Reason: "${finalReason}"`);
    }

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: `PROVIDER_STATUS_${newStatus}`,
      targetResource: 'providers',
      targetId: providerId,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        providerId,
        newStatus,
        reviewNotes: reviewNotes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Provider status updated to ${newStatus}`,
      provider: updated,
    });
  } catch (error: any) {
    console.error('Error updating provider status:', error);
    return NextResponse.json({ error: 'Failed to update provider status' }, { status: 500 });
  }
}
