import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { account } = context;
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    // If providerId is passed and caller is doctor/provider_admin, list for provider
    if (providerId && ['DOCTOR', 'PROVIDER_ADMIN'].includes(context.user.role)) {
      const appointments = db.getAppointmentsForProvider(providerId);
      return NextResponse.json({ success: true, appointments });
    }

    if (!account) {
      return NextResponse.json({ error: 'Patient account not found' }, { status: 404 });
    }

    const appointments = db.getAppointmentsForAccount(account.id);
    return NextResponse.json({ success: true, appointments });
  } catch (error: any) {
    console.error('Error listing appointments:', error);
    return NextResponse.json({ error: 'Failed to retrieve appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    if (!account) {
      return NextResponse.json({ error: 'Patient account required to book appointment' }, { status: 404 });
    }

    const body = await request.json();
    const { providerId, doctorId, doctorName, appointmentDate, timeSlot, reason, notes } = body;

    if (!providerId || !doctorId || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: providerId, doctorId, appointmentDate, and timeSlot are required' },
        { status: 400 }
      );
    }

    const provider = db.getProviderById(providerId);
    if (!provider) {
      return NextResponse.json({ error: 'Healthcare provider not found' }, { status: 404 });
    }

    // 1. Double-booking check
    const hasConflict = db.checkSlotConflict(providerId, doctorId, appointmentDate, timeSlot);
    if (hasConflict) {
      return NextResponse.json(
        { error: `Slot conflict: Doctor ${doctorName || 'selected'} is already booked on ${appointmentDate} at ${timeSlot}` },
        { status: 409 }
      );
    }

    // 2. Create appointment
    const appointment = db.createAppointment({
      accountId: account.id,
      providerId,
      providerName: provider.name,
      doctorId,
      doctorName: doctorName || 'Attending Physician',
      appointmentDate,
      timeSlot,
      status: 'CONFIRMED',
      reason: reason || 'General Healthcare Consultation',
      notes,
    });

    // 3. Dispatch Notification
    db.createNotification({
      userId: user.id,
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${appointment.doctorName} at ${provider.name} is confirmed for ${appointmentDate} at ${timeSlot}.`,
      category: 'APPOINTMENT',
      channel: 'IN_APP',
    });

    // 4. Audit Log
    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'APPOINTMENT_BOOKED',
      targetResource: 'appointments',
      targetId: appointment.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        appointmentId: appointment.id,
        providerId,
        doctorId,
        appointmentDate,
        timeSlot,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment successfully booked and confirmed',
        appointment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
