import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/sessions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      category,
      subject,
      message,
      priority,
    } = body;

    if (!fullName || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required support ticket fields.' },
        { status: 400 }
      );
    }

    const auth = await getCurrentUser();
    const sessionUser = auth?.user;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const ticketNumber = `AHCS-TKT-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-3)}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: sessionUser?.id || null,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        category: category.trim(),
        subject: subject.trim(),
        message: message.trim(),
        priority: priority === 'CRITICAL' ? 'CRITICAL' : priority === 'HIGH' ? 'HIGH' : priority === 'LOW' ? 'LOW' : 'MEDIUM',
        status: 'OPEN',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Support ticket registered successfully.',
      ticket: {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating support ticket.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    const sessionUser = auth?.user;
    const { searchParams } = new URL(req.url);
    const ticketNumberQuery = searchParams.get('ticketNumber');

    if (ticketNumberQuery) {
      const ticket = await prisma.supportTicket.findUnique({
        where: { ticketNumber: ticketNumberQuery.trim().toUpperCase() },
        select: {
          ticketNumber: true,
          category: true,
          subject: true,
          status: true,
          priority: true,
          createdAt: true,
          resolvedAt: true,
          adminNotes: true,
        },
      });

      if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, ticket });
    }

    // Otherwise list tickets (if officer/admin or logged-in user's own tickets)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (sessionUser.role === 'VERIFICATION_OFFICER' || sessionUser.role === 'ADMIN' || sessionUser.role === 'SUPER_ADMIN') {
      const tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return NextResponse.json({ success: true, tickets, count: tickets.length });
    }

    const userTickets = await prisma.supportTicket.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, tickets: userTickets });
  } catch (error: any) {
    console.error('Error querying support tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
