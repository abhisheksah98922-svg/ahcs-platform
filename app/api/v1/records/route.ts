import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { MedicalRecordType, MedicationItem } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetAccountId = searchParams.get('accountId');
    const providerId = searchParams.get('providerId');

    // Case 1: Provider fetching records for a patient
    if (targetAccountId && providerId) {
      if (!db.hasActiveConsent(targetAccountId, providerId)) {
        return NextResponse.json({
          error: 'Access forbidden: Active patient consent required to view clinical records',
        }, { status: 403 });
      }

      const records = db.getMedicalRecordsByAccountId(targetAccountId);
      return NextResponse.json({
        success: true,
        accountId: targetAccountId,
        records,
      });
    }

    // Case 2: Authenticated patient fetching their own records
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const account = context.account;
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const records = db.getMedicalRecordsByAccountId(account.id);
    return NextResponse.json({
      success: true,
      accountId: account.id,
      records,
    });
  } catch (error: any) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json({ error: 'Failed to retrieve medical records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountId,
      authorProviderId,
      authorProviderName,
      authorDoctorName,
      recordType,
      title,
      clinicalDiagnosis,
      clinicalNotes,
      medications,
      labObservations,
      recordDate,
    } = body;

    if (!accountId || !authorProviderId || !authorDoctorName || !recordType || !title) {
      return NextResponse.json({
        error: 'Missing required fields: accountId, authorProviderId, authorDoctorName, recordType, and title are mandatory',
      }, { status: 400 });
    }

    // Verify provider status
    const provider = db.getProviderById(authorProviderId);
    if (!provider || provider.status !== 'VERIFIED') {
      return NextResponse.json({
        error: 'Forbidden: Clinical records can only be authored by verified healthcare facilities',
      }, { status: 403 });
    }

    // Check consent: Provider must have active consent to append records to patient history
    const hasConsent = db.hasActiveConsent(accountId, authorProviderId);
    if (!hasConsent) {
      return NextResponse.json({
        error: 'Access denied: Active patient consent is required before clinical records or prescriptions can be issued',
      }, { status: 403 });
    }

    const record = db.createMedicalRecord({
      accountId,
      authorProviderId,
      authorProviderName: authorProviderName || provider.name,
      authorDoctorName: authorDoctorName.trim(),
      recordType: recordType as MedicalRecordType,
      title: title.trim(),
      clinicalDiagnosis: clinicalDiagnosis?.trim() || 'Clinical Examination',
      clinicalNotes: clinicalNotes?.trim() || '',
      medications: Array.isArray(medications) ? (medications as MedicationItem[]) : [],
      labObservations: labObservations?.trim() || undefined,
      recordDate: recordDate || new Date().toISOString().split('T')[0],
    });

    db.logAudit({
      actorId: null,
      actorRole: 'HEALTHCARE_PROVIDER_DOCTOR',
      action: 'MEDICAL_RECORD_CREATED',
      targetResource: 'medical_records',
      targetId: record.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        recordId: record.id,
        accountId,
        providerId: authorProviderId,
        doctorName: authorDoctorName,
        recordType,
        medicationCount: record.medications.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Clinical record and digital prescription saved to patient history.',
      record,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating medical record:', error);
    return NextResponse.json({ error: 'Failed to create medical record' }, { status: 500 });
  }
}
