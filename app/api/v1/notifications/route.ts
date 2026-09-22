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

    const notifications = db.getNotifications(context.user.id);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'Missing notificationId' }, { status: 400 });
    }

    const marked = db.markNotificationRead(notificationId);
    return NextResponse.json({
      success: true,
      marked,
    });
  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export const PATCH = POST;

