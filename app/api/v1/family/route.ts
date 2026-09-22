import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { FamilyRelationship, FamilyPermissionLevel } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const members = db.getFamilyMembers(context.account.id);
    return NextResponse.json({
      success: true,
      count: members.length,
      familyMembers: members,
    });
  } catch (error: any) {
    console.error('Error listing family members:', error);
    return NextResponse.json({ error: 'Failed to retrieve family members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const body = await request.json();
    const {
      memberClientId,
      familyMemberClientId,
      memberName,
      relationship,
      permissionLevel = 'EMERGENCY_ONLY',
      isGuardian = false,
    } = body;

    const finalClientId = memberClientId || familyMemberClientId;

    if (!finalClientId || !relationship) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: memberClientId and relationship are required' },
        { status: 400 }
      );
    }

    // Lookup target account by Client ID
    const targetClientId = db.findClientId(finalClientId);
    if (!targetClientId) {
      return NextResponse.json(
        { error: `No active AHCS account found matching Client ID ${finalClientId}` },
        { status: 404 }
      );
    }

    let finalMemberName = memberName;
    if (!finalMemberName) {
      const targetProfile = db.findProfileByAccountId(targetClientId.accountId);
      finalMemberName = targetProfile?.fullName || 'Family Dependent';
    }

    if (targetClientId.accountId === account.id) {
      return NextResponse.json(
        { error: 'Cannot link your own account as a family dependent' },
        { status: 400 }
      );
    }

    // Add Family Link
    const familyMember = db.addFamilyMember({
      primaryAccountId: account.id,
      memberAccountId: targetClientId.accountId,
      memberName: finalMemberName,
      memberClientId: finalClientId,
      relationship: relationship as FamilyRelationship,
      permissionLevel: permissionLevel as FamilyPermissionLevel,
      isGuardian: Boolean(isGuardian),
      status: 'ACTIVE',
    });

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'FAMILY_MEMBER_LINKED',
      targetResource: 'family_members',
      targetId: familyMember.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        memberClientId,
        relationship,
        permissionLevel,
      },
    });

    const responseMember = {
      ...familyMember,
      familyMemberClientId: familyMember.memberClientId,
    };

    return NextResponse.json(
      {
        success: true,
        message: `Family member ${finalMemberName} successfully linked`,
        familyMember: responseMember,
        member: responseMember,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error linking family member:', error);
    return NextResponse.json({ error: 'Failed to link family member' }, { status: 500 });
  }
}
