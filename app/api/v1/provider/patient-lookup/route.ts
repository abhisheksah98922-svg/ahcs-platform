import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { validateClientIdChecksum } from '@/lib/client-id';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, providerId, doctorName, isBreakGlassEmergency, auditReason } = body;

    if (!clientId || !providerId) {
      return NextResponse.json({ error: 'Missing clientId or providerId' }, { status: 400 });
    }

    const auth = await getCurrentUser();
    const ipAddress = request.headers.get('x-forwarded-for') || null;
    const userAgent = request.headers.get('user-agent') || null;

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

    // 4. Verify Provider or Break-Glass Emergency Exemption
    const isEmergencyTriage = isBreakGlassEmergency && providerId === 'PRV-EMERGENCY-TRIAGE';
    let provider = null;
    if (!isEmergencyTriage) {
      provider = db.getProviderById(providerId);
      if (!provider || provider.status !== 'VERIFIED') {
        return NextResponse.json({ error: 'Access denied: Healthcare facility must be an active verified provider' }, { status: 403 });
      }
    }

    // CASE A: Break-Glass Emergency Triage Request
    if (isBreakGlassEmergency) {
      if (!auditReason || typeof auditReason !== 'string' || auditReason.trim().length < 5) {
        return NextResponse.json({
          error: 'Break-Glass Emergency access requires a mandatory clinical justification reason.',
        }, { status: 400 });
      }

      const emergency = db.findEmergencyProfileByAccountId(account.id);

      db.logAudit({
        actorId: auth?.user?.id || null,
        actorRole: auth?.user?.role || 'EMERGENCY_CLINICIAN',
        action: 'BREAK_GLASS_EMERGENCY_ACCESS',
        targetResource: 'accounts',
        targetId: account.id,
        ipAddress,
        userAgent,
        metadata: {
          clientId: cleanId,
          doctorName: doctorName || 'Attending Casualty Officer',
          providerId,
          reason: auditReason.trim(),
          accessType: 'BREAK_GLASS_LIFE_SAFETY_EXEMPTION',
        },
      });

      return NextResponse.json({
        success: true,
        hasConsent: true,
        isBreakGlass: true,
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
          preferredHospital: emergency.preferredHospital,
        } : null,
        activeConsent: {
          id: `break_glass_${Date.now()}`,
          scope: 'EMERGENCY_VITALS_ONLY',
          status: 'ACTIVE',
          purpose: 'ACUTE_RESUSCITATION',
        },
        records: [], // Clinical history withheld in Break-Glass; only emergency vitals and critical alerts are disclosed
        message: 'Break-Glass emergency vitals retrieved under DPDP life-safety protocol. Event logged to compliance audit trail.',
      });
    }

    // CASE B: Standard Provider Consultation (requires consent)
    const hasConsent = db.hasActiveConsent(account.id, providerId);
    const consents = db.getConsentsForAccount(account.id).filter(c => c.providerId === providerId);
    const latestConsent = consents[0] || null;

    // Log lookup in audit trail
    db.logAudit({
      actorId: auth?.user?.id || null,
      actorRole: auth?.user?.role || 'PROVIDER_DOCTOR',
      action: 'PATIENT_LOOKUP_ATTEMPT',
      targetResource: 'accounts',
      targetId: account.id,
      ipAddress,
      userAgent,
      metadata: {
        clientId: cleanId,
        providerId,
        providerName: provider?.name,
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
