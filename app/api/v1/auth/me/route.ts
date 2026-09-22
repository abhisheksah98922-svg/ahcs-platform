import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/sessions';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await getCurrentUser();

    if (!auth) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        user: null,
      });
    }

    // Refresh related entities from DB
    const account = db.findAccountByUserId(auth.user.id);
    const profile = account ? db.findProfileByAccountId(account.id) : null;
    const clientId = account ? db.findClientIdByAccountId(account.id) : null;
    const card = account ? db.findCardByAccountId(account.id) : null;
    const qrToken = card ? db.findActiveQrTokenByCardId(card.id) : null;
    const verification = account ? db.findVerificationRequestByAccountId(account.id) : null;
    const emergencyProfile = account ? db.findEmergencyProfileByAccountId(account.id) : null;

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: auth.user.id,
        mobileNumber: auth.user.mobileNumber,
        email: auth.user.email,
        role: auth.user.role,
        status: auth.user.status,
      },
      account,
      profile,
      clientId,
      card,
      qrToken: qrToken ? { token: qrToken.tokenRaw, expiresAt: qrToken.expiresAt, scanCount: qrToken.scanCount } : null,
      verification,
      emergencyProfile,
    });
  } catch (err: any) {
    console.error('Auth Me Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error checking session' },
      { status: 500 }
    );
  }
}
