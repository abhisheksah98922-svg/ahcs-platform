import { NextResponse } from 'next/server';
import { requestOtp } from '@/lib/auth/otp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobileNumber } = body;

    if (!mobileNumber || typeof mobileNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid mobile number is required' },
        { status: 400 }
      );
    }

    const result = requestOtp(mobileNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, cooldownRemaining: result.cooldownRemaining },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP dispatched successfully',
      expiresAt: result.expiresAt,
      devCode: result.devCode, // populated in non-production for testing
    });
  } catch (err: any) {
    console.error('OTP Send Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing OTP request' },
      { status: 500 }
    );
  }
}
