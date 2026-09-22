import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuth } from '@/lib/auth/sessions';
import { db } from '@/lib/db/store';
import { generateSecureAccessToken, generateCardActivationCode } from '@/lib/tokens';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    const account = db.findAccountByUserId(auth.user.id);

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    const clientId = db.findClientIdByAccountId(account.id);
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Cannot replace card: No active Client ID issued' },
        { status: 400 }
      );
    }

    const currentCard = db.findCardByAccountId(account.id);
    const body = await request.json();
    const { reason } = body; // 'LOST', 'STOLEN', 'DAMAGED'

    if (currentCard) {
      // 1. Suspend / Revoke old card
      currentCard.status = 'REPLACED';
      db.updateCard(currentCard.id, currentCard);

      // 2. Invalidate all old QR tokens
      db.revokeQrTokensForCard(currentCard.id);

      db.logAudit({
        actorId: auth.user.id,
        actorRole: auth.user.role,
        action: 'CARD_REVOKED',
        targetResource: 'CARD',
        targetId: currentCard.id,
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
        metadata: { reason: reason || 'REPLACEMENT_REQUESTED' },
      });
    }

    // 3. Mint New Replacement Card with same permanent Client ID
    const { code, codeHash } = generateCardActivationCode();
    const newCardNumber = `CRD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCard = db.createCard({
      clientIdFk: clientId.id,
      accountId: account.id,
      cardNumber: newCardNumber,
      version: (currentCard?.version || 1) + 1,
      status: 'PENDING_ACTIVATION',
      activationCodeHash: codeHash,
      activatedAt: null,
      activatedByUserId: null,
      expiresAt: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // 4. Mint New Dynamic QR Token
    const tokenRaw = generateSecureAccessToken();
    const tokenHash = crypto.createHash('sha256').update(tokenRaw).digest('hex');

    db.createQrToken({
      cardId: newCard.id,
      tokenHash,
      tokenRaw,
      tokenType: 'EMERGENCY_QR',
      isRevoked: false,
      scanCount: 0,
      lastScannedAt: null,
      expiresAt: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    db.logAudit({
      actorId: auth.user.id,
      actorRole: auth.user.role,
      action: 'CARD_GENERATED',
      targetResource: 'CARD',
      targetId: newCard.id,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      metadata: { 
        cardNumber: newCard.cardNumber,
        replacementFor: currentCard?.cardNumber,
        clientId: clientId.clientId 
      },
    });

    return NextResponse.json({
      success: true,
      message: 'New replacement health card issued. Previous card and tokens have been revoked.',
      card: newCard,
      clientId: clientId.clientId,
      activationCode: code,
    });
  } catch (err: any) {
    console.error('Card Replacement Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error replacing card' },
      { status: 500 }
    );
  }
}
