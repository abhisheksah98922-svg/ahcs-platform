import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    const user = context?.user;
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      orderId,
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
    } = body;

    if (!orderId || !gatewayPaymentId) {
      return NextResponse.json({ error: 'Missing orderId or gatewayPaymentId' }, { status: 400 });
    }

    const order = db.getPaymentOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Cryptographic signature verification:
    // When Razorpay secret is set, HMAC SHA-256 signature is mandatory
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret) {
      if (!gatewaySignature || !gatewayOrderId) {
        return NextResponse.json(
          { error: 'Payment verification failed: missing gateway signature or gateway order ID' },
          { status: 400 }
        );
      }
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${gatewayOrderId}|${gatewayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== gatewaySignature) {
        db.updatePaymentOrderStatus(orderId, 'FAILED');
        return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
      }
    }

    // Mark order PAID
    const updated = db.updatePaymentOrderStatus(orderId, 'PAID', gatewayPaymentId);

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'PAYMENT_ORDER_VERIFIED_PAID',
      targetResource: 'payment_orders',
      targetId: orderId,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        orderId,
        gatewayPaymentId,
        amountPaise: order.amountPaise,
        planId: order.planId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Payment verified. Membership plan ${order.planName} is now active.`,
      order: updated,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
