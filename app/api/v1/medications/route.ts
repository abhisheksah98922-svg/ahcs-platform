import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { account } = context;

    // 1. Gather all provider-authored medications from patient records
    const records = db.getMedicalRecordsByAccountId(account.id);
    const prescribedMedications: any[] = [];

    for (const rec of records) {
      if (rec.medications && Array.isArray(rec.medications)) {
        for (const med of rec.medications) {
          prescribedMedications.push({
            prescriptionId: rec.id,
            prescribedByDoctor: rec.authorDoctorName,
            providerName: rec.authorProviderName,
            prescribedDate: rec.recordDate,
            medicineName: med.medicineName,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions || 'Take as directed by doctor',
            immutableNotice: 'Doctor-authored clinical prescription. Dosage and frequency are strictly locked and cannot be altered by system or AI.',
          });
        }
      }
    }

    // 2. Fetch logged adherence schedules
    const schedules = db.getMedicationSchedules(account.id);

    return NextResponse.json({
      success: true,
      count: prescribedMedications.length,
      prescribedMedications,
      adherenceSchedules: schedules,
    });
  } catch (error: any) {
    console.error('Error fetching medications:', error);
    return NextResponse.json({ error: 'Failed to retrieve medications' }, { status: 500 });
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
    const { action, scheduleId, medicineName, dosage, frequency, duration, taken, date } = body;

    // Action A: Create adherence tracking schedule for a prescribed medicine
    if (action === 'CREATE_SCHEDULE') {
      if (!medicineName || !dosage || !frequency) {
        return NextResponse.json({ error: 'Missing medicineName, dosage, or frequency' }, { status: 400 });
      }

      const schedule = db.createMedicationSchedule({
        accountId: account.id,
        medicineName,
        dosage,
        frequency,
        duration: duration || '30 days',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'ACTIVE',
        adherenceLog: [],
      });

      return NextResponse.json({
        success: true,
        message: 'Medication adherence schedule created',
        schedule,
      }, { status: 201 });
    }

    // Action B: Log adherence (Taken / Missed / Take Dose)
    if (action === 'LOG_ADHERENCE' || action === 'TAKE_DOSE') {
      let targetScheduleId = scheduleId;
      if (!targetScheduleId) {
        const schedules = db.getMedicationSchedules(account.id);
        if (schedules.length === 0) {
          const newSched = db.createMedicationSchedule({
            accountId: account.id,
            medicineName: medicineName || 'Amlodipine 5mg',
            dosage: dosage || '5mg',
            frequency: frequency || 'Once Daily',
            duration: duration || '30 days',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'ACTIVE',
            adherenceLog: [],
          });
          targetScheduleId = newSched.id;
        } else {
          targetScheduleId = schedules[0].id;
        }
      }

      const logDate = date || new Date().toISOString().split('T')[0];
      const isTaken = taken !== undefined ? Boolean(taken) : true;
      const updated = db.logMedicationAdherence(targetScheduleId, logDate, isTaken);

      if (!updated) {
        return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
      }

      db.logAudit({
        actorId: user.id,
        actorRole: user.role,
        action: 'MEDICATION_ADHERENCE_LOGGED',
        targetResource: 'medication_schedules',
        targetId: targetScheduleId,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: { date: logDate, taken: isTaken },
      });

      return NextResponse.json({
        success: true,
        message: 'Dose adherence recorded',
        log: {
          scheduleId: targetScheduleId,
          takenAt: new Date().toISOString(),
          date: logDate,
          taken: isTaken,
        },
        schedule: updated,
      });
    }

    return NextResponse.json({ error: 'Invalid action. Supported: CREATE_SCHEDULE, LOG_ADHERENCE, TAKE_DOSE' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in medication schedule:', error);
    return NextResponse.json({ error: 'Failed to process medication request' }, { status: 500 });
  }
}
