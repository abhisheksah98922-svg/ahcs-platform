import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const body = await request.json();
    const { familyMemberId } = body;

    if (!familyMemberId) {
      return NextResponse.json({ error: 'Missing familyMemberId' }, { status: 400 });
    }

    const members = db.getFamilyMembers(account.id);
    const targetMember = members.find(m => m.id === familyMemberId);
    if (!targetMember) {
      return NextResponse.json({ error: 'Family member record not found or unauthorized' }, { status: 404 });
    }

    const revoked = db.revokeFamilyMember(familyMemberId);

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'FAMILY_MEMBER_REVOKED',
      targetResource: 'family_members',
      targetId: familyMemberId,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        familyMemberId,
        memberClientId: targetMember.memberClientId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Family access revoked for ${targetMember.memberName}`,
      familyMember: revoked,
    });
  } catch (error: any) {
    console.error('Error revoking family member:', error);
    return NextResponse.json({ error: 'Failed to revoke family access' }, { status: 500 });
  }
}
