import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

    // Lab facility staff view
    if (providerId && ['DOCTOR', 'PROVIDER_ADMIN'].includes(context.user.role)) {
      const orders = db.getLabOrdersForProvider(providerId);
      return NextResponse.json({ success: true, count: orders.length, orders });
    }

    // Patient view
    if (!account) {
      return NextResponse.json({ error: 'Account required' }, { status: 404 });
    }

    const orders = db.getLabOrdersForAccount(account.id);
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    console.error('Error fetching lab orders:', error);
    return NextResponse.json({ error: 'Failed to retrieve lab orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account, clientId } = context;
    const body = await request.json();
    const { patientClientId, providerId, testName } = body;

    const finalPatientClientId = patientClientId || clientId?.clientId;
    const finalProviderId = providerId || 'PRV-103';

    if (!finalPatientClientId || !testName) {
      return NextResponse.json(
        { error: 'Missing required fields: patientClientId and testName are mandatory' },
        { status: 400 }
      );
    }

    const targetClient = db.findClientId(finalPatientClientId);
    if (!targetClient) {
      return NextResponse.json({ error: 'Invalid or unregistered patient Client ID' }, { status: 404 });
    }

    const provider = db.getProviderById(finalProviderId);
    if (!provider) {
      return NextResponse.json({ error: 'Invalid or unlisted lab provider' }, { status: 404 });
    }

    const orderNumber = `LBO-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const order = db.createLabOrder({
      orderNumber,
      patientClientId: finalPatientClientId,
      providerId: finalProviderId,
      providerName: provider.name,
      accountId: targetClient.accountId,
      testName,
      status: 'ORDERED',
    });

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'LAB_ORDER_CREATED',
      targetResource: 'lab_orders',
      targetId: order.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { orderNumber, testName, patientClientId },
    });

    return NextResponse.json({
      success: true,
      message: 'Diagnostic test order created',
      order,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lab order:', error);
    return NextResponse.json({ error: 'Failed to create lab order' }, { status: 500 });
  }
}
