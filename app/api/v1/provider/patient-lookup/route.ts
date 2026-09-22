import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { validateClientIdChecksum } from '@/lib/client-id';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, providerId, doctorName } = body;

    if (!clientId || !providerId) {
      return NextResponse.json({ error: 'Missing clientId or providerId' }, { status: 400 });
    }

    // 1. Checksum validation
    const cleanId = clientId.trim().toUpperCase();
    if (!validateClientIdChecksum(cleanId)) {
      return NextResponse.json({ error: 'Invalid AHCS Client ID format or checksum failure' }, { status: 400 });
    }

    // 2. Find Client Record
    const clientRec = db.findClientId(cleanId);
    if (!clientRec || !clientRec.isActive) {
      return NextResponse.json({ error: 'AHCS Client ID not found in active registry' }, { status: 404 });
    }

    // 3. Find Profile & Card
    const account = db.findAccountById(clientRec.accountId);
    const profile = db.findProfileByAccountId(clientRec.accountId);
    const card = db.findActiveCardByAccountId(clientRec.accountId);

    if (!account || !profile) {
      return NextResponse.json({ error: 'Patient account profile not found' }, { status: 404 });
    }

    // 4. Verify Provider
    const provider = db.getProviderById(providerId);
    if (!provider || provider.status !== 'VERIFIED') {
      return NextResponse.json({ error: 'Access denied: Healthcare facility must be an active verified provider' }, { status: 403 });
    }

    // 5. Check Consent Status
    const hasConsent = db.hasActiveConsent(account.id, providerId);
    const consents = db.getConsentsForAccount(account.id).filter(c => c.providerId === providerId);
    const latestConsent = consents[0] || null;

    // Log lookup in audit trail
    db.logAudit({
      actorId: null,
      actorRole: 'PROVIDER_DOCTOR',
      action: 'PATIENT_LOOKUP_ATTEMPT',
      targetResource: 'accounts',
      targetId: account.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        clientId: cleanId,
        providerId,
        providerName: provider.name,
        doctorName: doctorName || 'Attending Physician',
        consentActive: hasConsent,
      },
    });

    if (!hasConsent) {
      return NextResponse.json({
        success: true,
        hasConsent: false,
        patient: {
          accountId: account.id,
          clientId: cleanId,
          fullName: profile.fullName,
          gender: profile.gender,
          district: profile.district,
          cardStatus: card?.status || 'UNKNOWN',
        },
        activeConsent: null,
        pendingRequest: latestConsent?.status === 'REQUESTED' ? latestConsent : null,
        message: 'Patient found. Clinical records and prescriptions are restricted until patient grants consent.',
      });
    }

    // If Consent is active, fetch clinical records according to scope
    const emergency = db.findEmergencyProfileByAccountId(account.id);
    let records = db.getMedicalRecordsByAccountId(account.id);

    if (latestConsent?.scope === 'PRESCRIPTIONS_ONLY') {
      records = records.filter(r => r.recordType === 'PRESCRIPTION');
    } else if (latestConsent?.scope === 'LABS_ONLY') {
      records = records.filter(r => r.recordType === 'LAB_REPORT');
    }

    return NextResponse.json({
      success: true,
      hasConsent: true,
      patient: {
        accountId: account.id,
        clientId: cleanId,
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        bloodGroupSource: profile.bloodGroupSource,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactPhone: profile.emergencyContactPhone,
        cardStatus: card?.status || 'ACTIVE',
      },
      emergency: emergency ? {
        allergies: emergency.allergies,
        criticalConditions: emergency.criticalConditions,
        currentMedications: emergency.currentMedications,
      } : null,
      activeConsent: latestConsent,
      records,
      message: 'Active consent verified. Full clinical records loaded.',
    });
  } catch (error: any) {
    console.error('Error looking up patient:', error);
    return NextResponse.json({ error: 'Failed to look up patient' }, { status: 500 });
  }
}
