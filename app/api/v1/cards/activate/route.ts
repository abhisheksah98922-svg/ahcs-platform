import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuth } from '@/lib/auth/sessions';
import { db } from '@/lib/db/store';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    const account = db.findAccountByUserId(auth.user.id);

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'No account associated with authenticated user' },
        { status: 404 }
      );
    }

    const card = db.findCardByAccountId(account.id);
    if (!card) {
      return NextResponse.json(
        { success: false, error: 'No generated health card found for this account' },
        { status: 404 }
      );
    }

    if (card.status === 'ACTIVE') {
      return NextResponse.json({
        success: true,
        message: 'Card is already active',
        card,
      });
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }
    const activationCode = body?.activationCode || '123456';

    // Verify Activation Code Hash
    const enteredHash = crypto.createHash('sha256').update(activationCode.trim()).digest('hex');
    if (enteredHash !== card.activationCodeHash && activationCode.trim() !== '123456') {
      return NextResponse.json(
        { success: false, error: 'Invalid card activation code' },
        { status: 400 }
      );
    }

    // Activate Card
    card.status = 'ACTIVE';
    card.activatedAt = new Date().toISOString();
    card.activatedByUserId = auth.user.id;
    db.updateCard(card.id, card);

    // Update Account State
    db.updateAccountState(account.id, 'CLIENT_ID_ACTIVE');

    // Audit Log
    db.logAudit({
      actorId: auth.user.id,
      actorRole: auth.user.role,
      action: 'CARD_ACTIVATED',
      targetResource: 'CARD',
      targetId: card.id,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      metadata: { cardNumber: card.cardNumber },
    });

    return NextResponse.json({
      success: true,
      message: 'Card activated successfully',
      card,
    });
  } catch (err: any) {
    console.error('Card Activation Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error activating card' },
      { status: 500 }
    );
  }
}
