import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db/store';
import { hashSessionToken, SESSION_COOKIE_NAME, getCurrentUser } from '@/lib/auth/sessions';

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();
    const cookieStore = cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (rawToken) {
      const tokenHash = hashSessionToken(rawToken);
      db.revokeSession(tokenHash);
    }

    if (auth) {
      db.logAudit({
        actorId: auth.user.id,
        actorRole: auth.user.role,
        action: 'LOGOUT',
        targetResource: 'USER',
        targetId: auth.user.id,
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
        metadata: {},
      });
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (err: any) {
    console.error('Logout Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error during logout' },
      { status: 500 }
    );
  }
}
