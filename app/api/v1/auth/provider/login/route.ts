import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp';
import { db } from '@/lib/db/store';
import { createSessionForUser, SESSION_COOKIE_NAME } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, mobileNumber, code, doctorName, medicalCouncilNumber, staffRole = 'DOCTOR' } = body;

    if (!providerId || !mobileNumber || !code) {
      return NextResponse.json(
        { success: false, error: 'Hospital/Facility ID, registered staff mobile, and OTP code are required' },
        { status: 400 }
      );
    }

    // 1. Verify Healthcare Facility exists and is verified
    const provider = db.getProviderById(providerId);
    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Healthcare facility not found in AHCS Network' },
        { status: 404 }
      );
    }

    if (provider.status !== 'VERIFIED') {
      return NextResponse.json(
        { success: false, error: `Healthcare facility status is ${provider.status}. Only verified facilities can authenticate staff.` },
        { status: 403 }
      );
    }

    // 2. Verify OTP
    const cleanMobile = mobileNumber.replace(/[^0-9+]/g, '');
    const otpResult = verifyOtp(cleanMobile, code);
    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: otpResult.error || 'Invalid or expired OTP code' },
        { status: 400 }
      );
    }

    // 3. Find or Create Provider Staff User
    let user = db.findUserByMobile(cleanMobile);
    const assignedRole = staffRole === 'PROVIDER_ADMIN' ? 'PROVIDER_ADMIN' : 'DOCTOR';

    if (!user) {
      user = db.createUser({
        mobileNumber: cleanMobile,
        mobileVerifiedAt: new Date().toISOString(),
        email: `${cleanMobile.slice(-6)}@${provider.email.split('@')[1] || 'ahcs-hospital.in'}`,
        emailVerifiedAt: new Date().toISOString(),
        role: assignedRole,
        status: 'ACTIVE',
        authProvider: 'MOBILE_OTP',
        googleSub: null,
      });
    } else if (user.role === 'PATIENT') {
      // Elevate or set doctor role for hospital staff session
      user.role = assignedRole;
    }

    // 4. Create Session
    const userAgent = request.headers.get('user-agent') || 'Hospital EMR Terminal';
    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const session = createSessionForUser(user.id, userAgent, ipAddress);

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'PROVIDER_STAFF_LOGIN',
      targetResource: 'PROVIDER_PORTAL',
      targetId: provider.id,
      ipAddress,
      userAgent,
      metadata: {
        providerId: provider.id,
        providerName: provider.name,
        doctorName: doctorName || 'Attending Staff',
        medicalCouncilNumber: medicalCouncilNumber || provider.registrationNumber,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: `Staff authenticated at ${provider.name}. Redirecting to Doctor Portal...`,
      provider: {
        id: provider.id,
        name: provider.name,
        category: provider.category,
      },
      staff: {
        id: user.id,
        mobile: user.mobileNumber,
        role: user.role,
        doctorName: doctorName || 'Attending Staff',
        medicalCouncilNumber: medicalCouncilNumber || provider.registrationNumber,
      },
      redirectTo: '/provider/portal',
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.rawToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Provider Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during staff authentication' },
      { status: 500 }
    );
  }
}
