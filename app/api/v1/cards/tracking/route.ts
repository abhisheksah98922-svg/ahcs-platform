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
    const card = db.findCardByAccountId(account.id);
    if (!card) {
      return NextResponse.json({ error: 'No health card has been issued for this account' }, { status: 404 });
    }

    let delivery = db.getCardDeliveryByCardId(card.id);

    // If no tracking record exists yet, initialize it
    if (!delivery) {
      delivery = db.createCardDelivery({
        cardId: card.id,
        cardNumber: card.cardNumber,
        trackingNumber: `TRK-IN-${Date.now().toString().slice(-8)}`,
        courierPartner: 'India Post SpeedPost Health Logistics',
        currentStage: card.status === 'ACTIVE' ? 'DELIVERED' : 'PRINTING',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        history: [
          {
            stage: 'REQUESTED',
            timestamp: card.createdAt,
            location: 'AHCS Central Issuance Center, Bengaluru',
            note: 'Smart card personalization requisition created',
          },
          {
            stage: 'PRINTING',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            location: 'Secure Card Personalization Facility, Bengaluru',
            note: 'ISO/IEC 7810 ID-1 card substrate engraved and cryptographic keys initialized',
          },
        ],
      });
    }

    const tracking = {
      ...delivery,
      timeline: delivery.history,
    };

    return NextResponse.json({
      success: true,
      cardId: card.id,
      cardNumber: card.cardNumber,
      cardStatus: card.status,
      delivery,
      tracking,
    });
  } catch (error: any) {
    console.error('Error fetching card delivery tracking:', error);
    return NextResponse.json({ error: 'Failed to retrieve card tracking details' }, { status: 500 });
  }
}
