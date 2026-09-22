import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp';
import { db } from '@/lib/db/store';
import { createSessionForUser, SESSION_COOKIE_NAME } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobileNumber, code, badgeId } = body;

    if (!mobileNumber || !code) {
      return NextResponse.json(
        { success: false, error: 'Officer registered mobile number and 6-digit OTP code are required' },
        { status: 400 }
      );
    }

    // 1. Verify OTP
    const cleanMobile = mobileNumber.replace(/[^0-9+]/g, '');
    const otpResult = verifyOtp(cleanMobile, code);
    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: otpResult.error || 'Invalid or expired OTP code' },
        { status: 400 }
      );
    }

    // 2. Lookup Officer in database
    const user = db.findUserByMobile(cleanMobile);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ACCESS DENIED: No official Government Verification Officer credential found matching this mobile number.' 
        },
        { status: 403 }
      );
    }

    // 3. Strict Role Verification Gate
    const isAuthorizedOfficer = user.role === 'VERIFICATION_OFFICER' || user.role === 'SUPER_ADMIN';
    if (!isAuthorizedOfficer) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ACCESS DENIED: This portal is strictly restricted to designated Verification Officers. Normal citizen accounts cannot access this administrative portal.' 
        },
        { status: 403 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `Account suspended or locked (Status: ${user.status})` },
        { status: 403 }
      );
    }

    // 4. Create Session
    const userAgent = request.headers.get('user-agent') || 'Officer Workstation';
    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const session = createSessionForUser(user.id, userAgent, ipAddress);

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'OFFICER_PORTAL_LOGIN',
      targetResource: 'OFFICER_PORTAL',
      targetId: user.id,
      ipAddress,
      userAgent,
      metadata: { badgeId: badgeId || 'VO-DUTY-OFFICER' },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Officer authentication successful. Redirecting to verification operations...',
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
        badgeId: badgeId || 'VO-DUTY-OFFICER',
      },
      redirectTo: '/officer',
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.rawToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60, // 14 days
    });

    return response;
  } catch (error: any) {
    console.error('Officer Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during officer authentication' },
      { status: 500 }
    );
  }
}
