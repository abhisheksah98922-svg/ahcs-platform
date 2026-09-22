import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { PaymentGateway } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const body = await request.json();
    const { planId, planName, amountPaise, gateway = 'RAZORPAY' } = body;

    if (!planId || !planName || !amountPaise || amountPaise <= 0) {
      return NextResponse.json({ error: 'Invalid plan details or payment amount' }, { status: 400 });
    }

    // Generate external gateway order reference (e.g. order_rp_...)
    const gatewayOrderId = `order_${gateway.toLowerCase().slice(0, 2)}_${crypto.randomBytes(8).toString('hex')}`;

    const order = db.createPaymentOrder({
      accountId: account.id,
      planId,
      planName,
      amountPaise,
      currency: 'INR',
      status: 'CREATED',
      gateway: gateway as PaymentGateway,
      gatewayOrderId,
      gatewayPaymentId: null,
    });

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'PAYMENT_ORDER_CREATED',
      targetResource: 'payment_orders',
      targetId: order.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        orderId: order.id,
        planId,
        amountPaise,
        gatewayOrderId,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        gatewayOrderId: order.gatewayOrderId,
        amount: order.amountPaise,
        currency: order.currency,
        planName: order.planName,
        planId: order.planId,
      },
      // Configuration for client-side Razorpay / Stripe SDK
      gatewayConfig: {
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_ahcs_gateway_mock',
        name: 'AHCS Healthcare Identity',
        description: `Membership & Card Issuance: ${planName}`,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
