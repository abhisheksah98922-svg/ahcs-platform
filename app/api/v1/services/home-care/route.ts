import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/sessions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientName,
      serviceType,
      location,
      city,
      state,
      pinCode,
      preferredDate,
      contactPhone,
      contactEmail,
      notes,
    } = body;

    if (!patientName || !serviceType || !location || !city || !state || !pinCode || !preferredDate || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields for home care booking.' },
        { status: 400 }
      );
    }

    const careDate = new Date(preferredDate);
    if (isNaN(careDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid preferred date format.' },
        { status: 400 }
      );
    }

    const requestRecord = await prisma.homeCareRequest.create({
      data: {
        patientName: patientName.trim(),
        serviceType: serviceType.trim(),
        location: location.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        preferredDate: careDate,
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail ? contactEmail.trim().toLowerCase() : null,
        notes: notes ? notes.trim() : null,
        status: 'REQUESTED',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Home care request submitted successfully. A verified caregiver coordinator will contact you shortly.',
      request: {
        id: requestRecord.id,
        patientName: requestRecord.patientName,
        serviceType: requestRecord.serviceType,
        status: requestRecord.status,
        preferredDate: requestRecord.preferredDate,
        createdAt: requestRecord.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error submitting home care request:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing home care request.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    const sessionUser = auth?.user;
    if (!sessionUser || (sessionUser.role !== 'VERIFICATION_OFFICER' && sessionUser.role !== 'ADMIN' && sessionUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized back-office access' }, { status: 403 });
    }

    const requests = await prisma.homeCareRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      requests,
      count: requests.length,
    });
  } catch (error: any) {
    console.error('Error fetching home care requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
