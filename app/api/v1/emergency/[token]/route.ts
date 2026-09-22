import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing emergency lookup token' },
        { status: 400 }
      );
    }

    // 1. Locate active QR token in Database
    const qrToken = db.findQrTokenByRaw(token);
    if (!qrToken) {
      return NextResponse.json(
        { success: false, error: 'This QR emergency token is invalid, expired, or deactivated' },
        { status: 404 }
      );
    }

    if (qrToken.isRevoked) {
      return NextResponse.json(
        { success: false, error: 'This health card QR token has been revoked by the cardholder' },
        { status: 403 }
      );
    }

    if (new Date(qrToken.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This emergency QR token has expired. Please present updated card' },
        { status: 410 }
      );
    }

    // 2. Fetch Card & Account State
    const card = db.findCardById(qrToken.cardId);
    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Associated health card not found' },
        { status: 404 }
      );
    }

    if (card.status !== 'ACTIVE') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Access Denied: This health card status is currently ${card.status}. Only ACTIVE cards support emergency lookup.` 
        },
        { status: 403 }
      );
    }

    const account = db.findAccountById(card.accountId);
    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Associated account record not found' },
        { status: 404 }
      );
    }

    const profile = db.findProfileByAccountId(account.id);
    const clientId = db.findClientIdByAccountId(account.id);
    const emergencyProfile = db.findEmergencyProfileByAccountId(account.id);

    // 3. Increment Token Scan Count & Timestamp
    db.incrementQrScanCount(qrToken.id);

    // 4. Log Immutable Audit Record (Zero-leakage audit)
    db.logAudit({
      actorId: null,
      actorRole: 'EMERGENCY_SCANNER',
      action: 'EMERGENCY_ACCESS_TRIGGERED',
      targetResource: 'CARD',
      targetId: card.id,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      metadata: {
        tokenId: qrToken.id,
        clientId: clientId?.clientId,
      },
    });

    // 5. Construct Minimal Necessary Disclosure Dataset
    const minimalEmergencyData = {
      patientName: profile?.fullName || 'Anonymous Patient',
      clientId: clientId?.clientId || 'AHCS-IN-UNVERIFIED',
      cardNumber: card.cardNumber,
      bloodGroup: profile?.bloodGroup?.replace('_POS', '+').replace('_NEG', '-').replace('POS', '+').replace('NEG', '-') || 'UNKNOWN',
      bloodGroupSource: profile?.bloodGroupSource || 'UNKNOWN',
      emergencyContacts: [
        {
          name: profile?.emergencyContactName || 'Primary Emergency Contact',
          phone: profile?.emergencyContactPhone || '112',
          relation: profile?.emergencyContactRelation || 'Primary',
        },
      ],
      criticalAlerts: {
        allergies: emergencyProfile?.allergies || ['None declared'],
        criticalConditions: emergencyProfile?.criticalConditions || [],
        currentMedications: emergencyProfile?.currentMedications || [],
        organDonor: emergencyProfile?.organDonor || false,
        preferredHospital: emergencyProfile?.preferredHospital || null,
      },
      cardStatus: card.status,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      emergencyData: minimalEmergencyData,
    });
  } catch (err: any) {
    console.error('Emergency Resolution Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error resolving emergency QR access' },
      { status: 500 }
    );
  }
}
