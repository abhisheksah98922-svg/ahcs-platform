import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/sessions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationName,
      contactPerson,
      contactPhone,
      contactEmail,
      expectedAttendees,
      location,
      city,
      state,
      pinCode,
      requestedDate,
      notes,
    } = body;

    if (!organizationName || !contactPerson || !contactPhone || !location || !city || !state || !pinCode || !requestedDate) {
      return NextResponse.json(
        { error: 'Missing required fields for mobile medical camp booking.' },
        { status: 400 }
      );
    }

    const campDate = new Date(requestedDate);
    if (isNaN(campDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid requested date format.' },
        { status: 400 }
      );
    }

    const requestRecord = await prisma.mobileMedicalRequest.create({
      data: {
        organizationName: organizationName.trim(),
        contactPerson: contactPerson.trim(),
        phone: contactPhone.trim(),
        email: contactEmail ? contactEmail.trim().toLowerCase() : '',
        expectedPeople: Number(expectedAttendees) || 50,
        location: location.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        preferredDate: campDate,
        requiredServices: ['General Consultation', 'Point of Care Testing', 'Vitals'],
        notes: notes ? notes.trim() : null,
        status: 'REQUESTED',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mobile medical camp request submitted successfully. Our regional coordinator will contact you.',
      request: {
        id: requestRecord.id,
        organizationName: requestRecord.organizationName,
        status: requestRecord.status,
        preferredDate: requestRecord.preferredDate,
        createdAt: requestRecord.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error submitting mobile medical request:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing mobile medical request.' },
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

    const requests = await prisma.mobileMedicalRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      requests,
      count: requests.length,
    });
  } catch (error: any) {
    console.error('Error fetching mobile medical requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
