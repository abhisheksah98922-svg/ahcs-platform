import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/sessions';

export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    const sessionUser = auth?.user;
    if (!sessionUser || (sessionUser.role !== 'VERIFICATION_OFFICER' && sessionUser.role !== 'ADMIN' && sessionUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Officer access required' }, { status: 403 });
    }

    const [
      totalUsers,
      totalAccounts,
      verifiedClientIds,
      activeCards,
      activeEmergencyProfiles,
      totalProviders,
      verifiedProviders,
      mobileMedicalRequests,
      homeCareRequests,
      openSupportTickets,
      appointmentsCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.clientId.count({ where: { isActive: true } }),
      prisma.card.count({ where: { status: 'ACTIVE' } }),
      prisma.emergencyProfile.count({ where: { isActive: true } }),
      prisma.provider.count(),
      prisma.provider.count({ where: { status: 'VERIFIED' } }),
      prisma.mobileMedicalRequest.count(),
      prisma.homeCareRequest.count(),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.appointment.count(),
    ]);

    // Fetch recent requests
    const [recentMobile, recentHomeCare, recentTickets] = await Promise.all([
      prisma.mobileMedicalRequest.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.homeCareRequest.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.supportTicket.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalAccounts,
        verifiedClientIds,
        activeCards,
        activeEmergencyProfiles,
        totalProviders,
        verifiedProviders,
        mobileMedicalRequests,
        homeCareRequests,
        openSupportTickets,
        appointmentsCount,
      },
      recentMobile,
      recentHomeCare,
      recentTickets,
    });
  } catch (error: any) {
    console.error('Error in admin stats API:', error);
    return NextResponse.json({ error: 'Failed to load administrative statistics' }, { status: 500 });
  }
}
