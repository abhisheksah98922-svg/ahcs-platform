import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || body.clientId || body.token || '').trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Please provide an AHCS Client ID or QR Verification Token.' },
        { status: 400 }
      );
    }

    // 1. Try finding by Client ID (e.g., AHCS-DEL-2025-0001)
    let clientIdRecord = await prisma.clientId.findUnique({
      where: { clientId: query.toUpperCase() },
      include: {
        account: {
          include: {
            profile: true,
            cards: {
              include: {
                nfcCredentials: true,
              },
            },
          },
        },
      },
    });

    // 2. If not found by Client ID, try finding by QR Token string
    if (!clientIdRecord) {
      const qrRecord = await prisma.qrToken.findUnique({
        where: { token: query },
        include: {
          card: {
            include: {
              account: {
                include: {
                  profile: true,
                  clientId: true,
                  cards: {
                    include: {
                      nfcCredentials: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (qrRecord?.card?.account?.clientId) {
        const foundAccount = qrRecord.card.account;
        clientIdRecord = {
          ...foundAccount.clientId,
          account: foundAccount,
        } as any;
      }
    }

    if (!clientIdRecord) {
      return NextResponse.json({
        valid: false,
        status: 'NOT_FOUND',
        message: 'No registered AHCS credential matches the provided identifier.',
      }, { status: 404 });
    }

    const account = clientIdRecord.account;
    const cards = account?.cards || [];
    const activeCard = cards.find(c => c.status === 'ACTIVE') || cards[0];
    const profile = account?.profile;

    const isRevoked = !clientIdRecord.isActive || (activeCard && activeCard.status === 'REVOKED');
    const isExpired = activeCard && activeCard.expiresAt && new Date(activeCard.expiresAt) < new Date();

    let computedStatus = 'ACTIVE';
    if (isRevoked) {
      computedStatus = 'REVOKED';
    } else if (isExpired) {
      computedStatus = 'EXPIRED';
    } else if (activeCard && activeCard.status === 'SUSPENDED') {
      computedStatus = 'SUSPENDED';
    }

    // Mask name for privacy: "A*** S***"
    const rawName = profile?.fullName || 'AHCS Member';
    const nameParts = rawName.split(' ');
    const maskedName = nameParts.map((p: string) => p.length > 1 ? `${p[0]}${'*'.repeat(p.length - 1)}` : p).join(' ');

    // Mask Client ID: "AHCS-DEL-****-1002"
    const rawId = clientIdRecord.clientId;
    const idParts = rawId.split('-');
    const maskedId = idParts.length >= 4 
      ? `${idParts[0]}-${idParts[1]}-****-${idParts[3]}` 
      : `${rawId.slice(0, 4)}****${rawId.slice(-4)}`;

    const hasNfc = activeCard?.nfcCredentials && activeCard.nfcCredentials.length > 0;
    const cardType = hasNfc ? 'PHYSICAL_SMART_CARD' : 'DIGITAL_HEALTH_CARD';

    return NextResponse.json({
      valid: computedStatus === 'ACTIVE',
      status: computedStatus,
      clientIdMasked: maskedId,
      holderNameInitial: maskedName,
      cardType,
      issuedAt: activeCard?.createdAt || clientIdRecord.issuedAt,
      expiresAt: activeCard?.expiresAt || null,
      networkEligible: computedStatus === 'ACTIVE',
      disclaimer: 'Verification reflects cryptographic platform status only. AHCS is a private healthcare network credential and not an official government identity.',
    });
  } catch (error: any) {
    console.error('Error during credential verification:', error);
    return NextResponse.json(
      { error: 'Internal server error while verifying credential.' },
      { status: 500 }
    );
  }
}
