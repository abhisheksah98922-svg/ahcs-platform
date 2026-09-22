import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { AppointmentStatus } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const body = await request.json();
    const { appointmentId, status, notes } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Missing appointmentId or status' }, { status: 400 });
    }

    const appointment = db.getAppointmentById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Permission check: either the patient who booked it, or the doctor/provider staff
    const isPatient = account && appointment.accountId === account.id;
    const isProviderStaff = ['DOCTOR', 'PROVIDER_ADMIN', 'ADMIN'].includes(user.role);

    if (!isPatient && !isProviderStaff) {
      return NextResponse.json({ error: 'Unauthorized to modify this appointment' }, { status: 403 });
    }

    const updated = db.updateAppointmentStatus(appointmentId, status as AppointmentStatus, notes);

    // Audit Log
    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: `APPOINTMENT_${status}`,
      targetResource: 'appointments',
      targetId: appointmentId,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { appointmentId, newStatus: status, notes },
    });

    // Notify patient
    db.createNotification({
      userId: user.id,
      title: `Appointment ${status}`,
      message: `Your appointment with Dr. ${appointment.doctorName} status is now ${status}.`,
      category: 'APPOINTMENT',
      channel: 'IN_APP',
    });

    return NextResponse.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: updated,
    });
  } catch (error: any) {
    console.error('Error updating appointment status:', error);
    return NextResponse.json({ error: 'Failed to update appointment status' }, { status: 500 });
  }
}

export const PATCH = POST;

