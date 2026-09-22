import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export interface TimelineEvent {
  id: string;
  type: 'CONSULTATION' | 'PRESCRIPTION' | 'LAB_REPORT' | 'APPOINTMENT' | 'VAULT_DOCUMENT';
  title: string;
  date: string;
  providerName: string;
  details: string;
  metadata?: any;
}

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const { searchParams } = new URL(request.url);
    const targetAccountId = searchParams.get('accountId') || account?.id;

    if (!targetAccountId) {
      return NextResponse.json({ error: 'Target account ID required' }, { status: 400 });
    }

    // Authorization check: Self, authorized family member, or doctor with consent
    const isSelf = account && account.id === targetAccountId;
    const hasFamilyAccess = account && db.canAccessFamilyRecords(account.id, targetAccountId, 'MEDICAL_RECORD');
    const isDoctorWithConsent = user.role === 'DOCTOR' && db.hasActiveConsent(targetAccountId, user.id);

    if (!isSelf && !hasFamilyAccess && !isDoctorWithConsent) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not possess active consent or guardianship to view this health timeline' },
        { status: 403 }
      );
    }

    const events: TimelineEvent[] = [];

    // 1. Clinical Encounters / Medical Records
    const medicalRecords = db.getMedicalRecordsByAccountId(targetAccountId);
    for (const record of medicalRecords) {
      events.push({
        id: record.id,
        type: record.recordType === 'PRESCRIPTION' ? 'PRESCRIPTION' : 'CONSULTATION',
        title: record.title || 'Clinical Consultation',
        date: record.recordDate || record.createdAt,
        providerName: record.authorProviderName || 'Verified Healthcare Provider',
        details: record.clinicalDiagnosis || record.clinicalNotes,
        metadata: {
          doctorName: record.authorDoctorName,
          medicationsCount: record.medications?.length || 0,
        },
      });
    }

    // 2. Appointments
    const appointments = db.getAppointmentsForAccount(targetAccountId);
    for (const apt of appointments) {
      events.push({
        id: apt.id,
        type: 'APPOINTMENT',
        title: `Appointment: ${apt.reason}`,
        date: apt.appointmentDate,
        providerName: apt.providerName,
        details: `Status: ${apt.status} at ${apt.timeSlot} with Dr. ${apt.doctorName}`,
        metadata: { status: apt.status, timeSlot: apt.timeSlot },
      });
    }

    // 3. Vault Documents
    const vaultDocs = db.getVaultDocuments(targetAccountId);
    for (const doc of vaultDocs) {
      events.push({
        id: doc.id,
        type: 'VAULT_DOCUMENT',
        title: doc.title,
        date: doc.createdAt,
        providerName: 'Personal Medical Vault',
        details: `Document Type: ${doc.documentType} (${Math.round(doc.fileSizeBytes / 1024)} KB)`,
        metadata: { documentType: doc.documentType },
      });
    }

    // 4. Lab Orders
    const labOrders = db.getLabOrdersForAccount(targetAccountId);
    for (const lab of labOrders) {
      events.push({
        id: lab.id,
        type: 'LAB_REPORT',
        title: `Diagnostic Lab: ${lab.testName}`,
        date: lab.createdAt,
        providerName: lab.providerName,
        details: `Order #${lab.orderNumber} - Status: ${lab.status}`,
        metadata: { status: lab.status, orderNumber: lab.orderNumber },
      });
    }

    // Chronological Sort: Descending (latest first)
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Grouping by Year
    const timelineByYear: Record<string, TimelineEvent[]> = {};
    for (const ev of events) {
      const year = new Date(ev.date).getFullYear().toString() || '2026';
      if (!timelineByYear[year]) {
        timelineByYear[year] = [];
      }
      timelineByYear[year].push(ev);
    }

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'HEALTH_TIMELINE_ACCESSED',
      targetResource: 'health_timeline',
      targetId: targetAccountId,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { eventCount: events.length },
    });

    return NextResponse.json({
      success: true,
      totalEvents: events.length,
      timeline: events,
      timelineByYear,
    });
  } catch (error: any) {
    console.error('Error fetching health timeline:', error);
    return NextResponse.json({ error: 'Failed to retrieve health timeline' }, { status: 500 });
  }
}
