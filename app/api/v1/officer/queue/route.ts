import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/sessions';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await getCurrentUser();

    // Verify officer/admin authorization
    if (!auth || (auth.user.role !== 'VERIFICATION_OFFICER' && auth.user.role !== 'SUPER_ADMIN' && auth.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'FORBIDDEN: Verification Officer access required. Please login with an officer credential.' 
        },
        { status: 403 }
      );
    }

    const queue = db.getPendingVerificationQueue();

    return NextResponse.json({
      success: true,
      officer: {
        id: auth.user.id,
        mobileNumber: auth.user.mobileNumber,
        role: auth.user.role,
      },
      queueLength: queue.length,
      tickets: queue,
    });
  } catch (err: any) {
    console.error('Officer Queue Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching officer queue' },
      { status: 500 }
    );
  }
}
