import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp';
import { db } from '@/lib/db/store';
import { createSessionForUser, SESSION_COOKIE_NAME } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mobileNumber = body.mobileNumber;
    const email = body.email?.trim().toLowerCase();
    const code = body.code || body.otp;

    const identifier = email || mobileNumber;

    if (!identifier || !code) {
      return NextResponse.json(
        { success: false, error: 'Mobile number or email, and 6-digit OTP code are required' },
        { status: 400 }
      );
    }

    // 1. Verify OTP
    const otpResult = verifyOtp(identifier, code);
    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: otpResult.error },
        { status: 400 }
      );
    }

    // 2. Find or Create User
    const cleanMobile = mobileNumber ? mobileNumber.replace(/[^0-9+]/g, '') : '';
    let user = cleanMobile ? db.findUserByMobile(cleanMobile) : null;
    if (!user && email) {
      user = db.findUserByEmail(email);
    }

    let isNewUser = false;

    if (!user) {
      user = db.createUser({
        mobileNumber: cleanMobile || `+9100000${Date.now().toString().slice(-5)}`,
        mobileVerifiedAt: cleanMobile ? new Date().toISOString() : null,
        email: email || null,
        emailVerifiedAt: email ? new Date().toISOString() : null,
        role: 'PATIENT',
        status: 'ACTIVE',
        authProvider: email ? 'HYBRID' : 'MOBILE_OTP',
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
        metadata: { mobile: cleanMobile, email },
      });
    } else {
      // Update email if provided now and not set
      if (email && !user.email) {
        db.updateUser(user.id, {
          email,
          emailVerifiedAt: new Date().toISOString(),
        });
      }

      db.logAudit({
        actorId: user.id,
        actorRole: user.role,
        action: 'LOGIN',
        targetResource: 'USER',
        targetId: user.id,
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
        metadata: { method: email ? 'GMAIL_OTP' : 'MOBILE_OTP' },
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
        email: user.email,
        role: user.role,
        status: user.status,
      },
      account,
      profile,
      clientId,
      card,
      sessionExpiresAt: expiresAt,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: rawToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60, // 14 days
    });

    return response;
  } catch (err: any) {
    console.error('OTP Verify Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error verifying OTP' },
      { status: 500 }
    );
  }
}
