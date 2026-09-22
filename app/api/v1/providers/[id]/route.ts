import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Provider ID required' }, { status: 400 });
    }

    const provider = db.getProviderById(id);
    if (!provider) {
      return NextResponse.json({ error: 'Healthcare provider not found' }, { status: 404 });
    }

    // Include doctors or appointments if available
    const appointments = db.getAppointmentsForProvider(id);

    return NextResponse.json({
      success: true,
      provider,
      upcomingAppointmentsCount: appointments.filter(a => a.status === 'CONFIRMED').length,
    });
  } catch (error: any) {
    console.error('Error fetching provider by ID:', error);
    return NextResponse.json({ error: 'Failed to retrieve provider details' }, { status: 500 });
  }
}
