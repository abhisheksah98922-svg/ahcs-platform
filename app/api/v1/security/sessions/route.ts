import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, session } = context;
    if (!session) {
      return NextResponse.json({ error: 'Active session not found' }, { status: 401 });
    }

    // Fetch all user sessions
    const sessions = db.getUserSessions(user.id);
    const activeSessions = sessions.map((s: any) => ({
      id: s.id,
      ipAddress: s.ipAddress || '127.0.0.1',
      userAgent: s.userAgent || 'Web Browser',
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.id === session.id,
    }));

    // Fetch user audit logs
    const auditLogs = db.getAuditLogsByActor(user.id).slice(0, 20);

    return NextResponse.json({
      success: true,
      activeSessionsCount: activeSessions.length,
      sessions: activeSessions,
      recentActivity: auditLogs,
    });
  } catch (error: any) {
    console.error('Error fetching security sessions:', error);
    return NextResponse.json({ error: 'Failed to retrieve security sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, session } = context;
    if (!session) {
      return NextResponse.json({ error: 'Active session not found' }, { status: 401 });
    }
    const body = await request.json();
    const { action } = body;

    if (action === 'LOGOUT_ALL_OTHER') {
      const allSessions = db.getUserSessions(user.id);
      let revokedCount = 0;

      for (const s of allSessions) {
        if (s.id !== session.id) {
          db.deleteSession(s.sessionTokenHash);
          revokedCount++;
        }
      }

      db.logAudit({
        actorId: user.id,
        actorRole: user.role,
        action: 'SECURITY_LOGOUT_ALL_OTHER_SESSIONS',
        targetResource: 'user_sessions',
        targetId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: { revokedCount },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully terminated ${revokedCount} other active session(s). Your current session remains active.`,
        revokedCount,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in security session management:', error);
    return NextResponse.json({ error: 'Failed to execute security session action' }, { status: 500 });
  }
}
