import { NextResponse } from 'next/server';
import { requestOtp } from '@/lib/auth/otp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobileNumber, email } = body;

    const identifier = mobileNumber || email;

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid mobile number or email address is required' },
        { status: 400 }
      );
    }

    const result = await requestOtp(identifier, email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, cooldownRemaining: result.cooldownRemaining },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.channel === 'EMAIL' 
        ? `Security OTP dispatched to ${result.recipient}. Please check your inbox.`
        : 'OTP dispatched successfully via SMS.',
      expiresAt: result.expiresAt,
      devCode: result.devCode,
      gatewayActive: result.gatewayActive,
      channel: result.channel,
      recipient: result.recipient,
    });
  } catch (err: any) {
    console.error('OTP Send Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error processing OTP request' },
      { status: 500 }
    );
  }
}
