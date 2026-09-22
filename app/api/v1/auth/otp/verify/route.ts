import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp';
import { db } from '@/lib/db/store';
import { createSessionForUser, SESSION_COOKIE_NAME } from '@/lib/auth/sessions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mobileNumber = body.mobileNumber;
    const code = body.code || body.otp;

    if (!mobileNumber || !code) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and 6-digit OTP code are required' },
        { status: 400 }
      );
    }

    // 1. Verify OTP
    const otpResult = verifyOtp(mobileNumber, code);
    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: otpResult.error },
        { status: 400 }
      );
    }

    // 2. Find or Create User
    const cleanMobile = mobileNumber.replace(/[^0-9+]/g, '');
    let user = db.findUserByMobile(cleanMobile);
    let isNewUser = false;

    if (!user) {
      user = db.createUser({
        mobileNumber: cleanMobile,
        mobileVerifiedAt: new Date().toISOString(),
        email: null,
        emailVerifiedAt: null,
        role: 'PATIENT',
        status: 'ACTIVE',
        authProvider: 'MOBILE_OTP',
        googleSub: null,
      });
      isNewUser = true;

      // Automatically create healthcare account
      db.createAccount(user.id);

      db.logAudit({
        actorId: user.id,
        actorRole: user.role,
        action: 'ACCOUNT_CREATED',
        targetResource: 'USER',
        targetId: user.id,
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
        metadata: { mobile: cleanMobile },
      });
    } else {
      db.logAudit({
        actorId: user.id,
        actorRole: user.role,
        action: 'LOGIN',
        targetResource: 'USER',
        targetId: user.id,
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
        metadata: { method: 'MOBILE_OTP' },
      });
    }

    // 3. Create Session Token
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || undefined;
    const { rawToken, expiresAt } = createSessionForUser(user.id, userAgent, ipAddress);

    // 4. Return response with HttpOnly cookie
    const account = db.findAccountByUserId(user.id);
    const profile = account ? db.findProfileByAccountId(account.id) : null;
    const clientId = account ? db.findClientIdByAccountId(account.id) : null;
    const card = account ? db.findCardByAccountId(account.id) : null;

    const response = NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        status: user.status,
      },
      account,
      profile,
      clientId,
      card,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: rawToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiresAt),
    });

    return response;
  } catch (err: any) {
    console.error('OTP Verify Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error verifying OTP' },
      { status: 500 }
    );
  }
}
