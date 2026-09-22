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

    const { user } = context;
    if (!['VERIFICATION_OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Officer permissions required to adjudicate claims' }, { status: 403 });
    }

    const body = await request.json();
    const { claimId, decision, approvedAmountPaise, approvedAmount, notes } = body;
    const finalApprovedPaise =
      approvedAmountPaise !== undefined
        ? approvedAmountPaise
        : approvedAmount !== undefined
        ? approvedAmount * 100
        : 0;

    if (!claimId || !decision) {
      return NextResponse.json({ error: 'Missing claimId or decision' }, { status: 400 });
    }

    const validDecisions = ['APPROVED', 'REJECTED', 'SETTLED'];
    if (!validDecisions.includes(decision)) {
      return NextResponse.json({ error: `Invalid decision. Must be: ${validDecisions.join(', ')}` }, { status: 400 });
    }

    const updated = db.adjudicateClaim(claimId, decision, finalApprovedPaise, notes);
    if (!updated) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: `CLAIM_${decision}`,
      targetResource: 'claims',
      targetId: claimId,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { decision, approvedAmountPaise, notes },
    });

    return NextResponse.json({
      success: true,
      message: `Claim ${claimId} successfully transitioned to ${decision}`,
      claim: updated,
    });
  } catch (error: any) {
    console.error('Error adjudicating claim:', error);
    return NextResponse.json({ error: 'Failed to adjudicate claim' }, { status: 500 });
  }
}
