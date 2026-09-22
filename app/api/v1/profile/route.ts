import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/sessions';
import { db } from '@/lib/db/store';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    const account = db.findAccountByUserId(auth.user.id);

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found for authenticated user' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      addressLine1,
      district,
      stateProvince,
      pinCode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
    } = body;

    if (!fullName || !dateOfBirth || !district || !emergencyContactName || !emergencyContactPhone) {
      return NextResponse.json(
        { success: false, error: 'Required profile fields are missing' },
        { status: 400 }
      );
    }

    // Upsert Profile
    const profile = db.upsertProfile({
      accountId: account.id,
      fullName: fullName.trim(),
      dateOfBirth,
      gender: gender || 'PREFER_NOT_TO_SAY',
      bloodGroup: bloodGroup || 'UNKNOWN',
      bloodGroupSource: 'USER_DECLARED', // Never mark verified unless backed by verified lab/document
      addressLine1: addressLine1 || '',
      district: district.trim(),
      stateProvince: stateProvince || 'Karnataka',
      pinCode: pinCode || '',
      countryCode: 'IN',
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyContactRelation: emergencyContactRelation || 'Contact',
    });

    // Advance Account State
    if (account.state === 'REGISTERED') {
      db.updateAccountState(account.id, 'PROFILE_COMPLETED');
    }

    // Upsert Emergency Profile
    db.upsertEmergencyProfile({
      accountId: account.id,
      isActive: true,
      allergies: body.allergies || ['None declared'],
      criticalConditions: body.criticalConditions || [],
      currentMedications: body.currentMedications || [],
      organDonor: Boolean(body.organDonor),
      preferredHospital: body.preferredHospital || null,
    });

    // Audit Log
    db.logAudit({
      actorId: auth.user.id,
      actorRole: auth.user.role,
      action: 'PROFILE_UPDATED',
      targetResource: 'PROFILE',
      targetId: profile.id,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      metadata: { bloodGroupSource: 'USER_DECLARED' },
    });

    return NextResponse.json({
      success: true,
      profile,
      accountState: account.state,
    });
  } catch (err: any) {
    console.error('Profile Update Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error updating profile' },
      { status: err.message?.includes('UNAUTHORIZED') ? 401 : 500 }
    );
  }
}
