import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { FamilyPermissionLevel } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const body = await request.json();
    const { familyMemberId, familyMemberClientId, permissionLevel } = body;

    if ((!familyMemberId && !familyMemberClientId) || !permissionLevel) {
      return NextResponse.json({ error: 'Missing familyMemberId/familyMemberClientId or permissionLevel' }, { status: 400 });
    }

    const members = db.getFamilyMembers(account.id);
    const targetMember = members.find(
      m => m.id === familyMemberId || m.memberClientId === familyMemberClientId
    );
    if (!targetMember) {
      return NextResponse.json({ error: 'Family member record not found or unauthorized' }, { status: 404 });
    }

    const updated = db.updateFamilyPermissions(targetMember.id, permissionLevel as FamilyPermissionLevel);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update family permissions' }, { status: 500 });
    }

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'FAMILY_PERMISSIONS_UPDATED',
      targetResource: 'family_members',
      targetId: targetMember.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        familyMemberId: targetMember.id,
        newPermissionLevel: permissionLevel,
      },
    });

    const responseMember = {
      ...updated,
      familyMemberClientId: updated.memberClientId,
    };

    return NextResponse.json({
      success: true,
      message: 'Family member permissions updated',
      familyMember: responseMember,
      member: responseMember,
    });
  } catch (error: any) {
    console.error('Error updating family permissions:', error);
    return NextResponse.json({ error: 'Failed to update family permissions' }, { status: 500 });
  }
}

export { POST as PATCH };
