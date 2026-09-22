import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

// In-memory / persistent idempotent event tracker
const processedWebhookEvents = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_KEY_SECRET || 'ahcs_prod_webhook_secret_hmac';

    // 1. Mandatory Cryptographic Signature Verification
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature webhook header' },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      db.logAudit({
        actorId: null,
        actorRole: 'PAYMENT_GATEWAY_WEBHOOK',
        action: 'WEBHOOK_SIGNATURE_MISMATCH_REJECTED',
        targetResource: 'payment_webhook',
        targetId: null,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: { receivedSignature: signature },
      });

      return NextResponse.json(
        { error: 'Invalid HMAC-SHA256 webhook signature' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.id || payload.event_id;

    // 2. Idempotency & Duplicate Protection
    if (eventId && processedWebhookEvents.has(eventId)) {
      return NextResponse.json({
        success: true,
        message: 'Duplicate webhook event already processed (idempotent)',
        eventId,
      });
    }

    if (eventId) {
      processedWebhookEvents.add(eventId);
    }

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;
    const gatewayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const gatewayPaymentId = paymentEntity?.id;

    // 3. Webhook Transaction State Machine
    if (event === 'payment.captured' || event === 'order.paid') {
      if (gatewayOrderId) {
        // Locate internal order by gatewayOrderId
        const allOrders = db.listPaymentOrders?.() || [];
        const matchingOrder = allOrders.find(o => o.gatewayOrderId === gatewayOrderId);

        if (matchingOrder) {
          db.updatePaymentOrderStatus(matchingOrder.id, 'PAID', gatewayPaymentId);

          db.logAudit({
            actorId: null,
            actorRole: 'PAYMENT_GATEWAY_WEBHOOK',
            action: 'PAYMENT_ORDER_WEBHOOK_CAPTURED',
            targetResource: 'payment_orders',
            targetId: matchingOrder.id,
            ipAddress: request.headers.get('x-forwarded-for') || null,
            userAgent: request.headers.get('user-agent') || null,
            metadata: {
              eventId,
              gatewayOrderId,
              gatewayPaymentId,
              amount: paymentEntity?.amount,
            },
          });
        }
      }
    } else if (event === 'payment.failed') {
      if (gatewayOrderId) {
        const allOrders = db.listPaymentOrders?.() || [];
        const matchingOrder = allOrders.find(o => o.gatewayOrderId === gatewayOrderId);
        if (matchingOrder) {
          db.updatePaymentOrderStatus(matchingOrder.id, 'FAILED');
          db.logAudit({
            actorId: null,
            actorRole: 'PAYMENT_GATEWAY_WEBHOOK',
            action: 'PAYMENT_ORDER_WEBHOOK_FAILED',
            targetResource: 'payment_orders',
            targetId: matchingOrder.id,
            ipAddress: request.headers.get('x-forwarded-for') || null,
            userAgent: request.headers.get('user-agent') || null,
            metadata: { eventId, error_code: paymentEntity?.error_code },
          });
        }
      }
    } else if (event === 'refund.processed') {
      if (gatewayOrderId) {
        const allOrders = db.listPaymentOrders?.() || [];
        const matchingOrder = allOrders.find(o => o.gatewayOrderId === gatewayOrderId);
        if (matchingOrder) {
          db.updatePaymentOrderStatus(matchingOrder.id, 'FAILED'); // or refunded
          db.logAudit({
            actorId: null,
            actorRole: 'PAYMENT_GATEWAY_WEBHOOK',
            action: 'PAYMENT_ORDER_REFUND_PROCESSED',
            targetResource: 'payment_orders',
            targetId: matchingOrder.id,
            ipAddress: request.headers.get('x-forwarded-for') || null,
            userAgent: request.headers.get('user-agent') || null,
            metadata: { eventId, refundId: payload.payload?.refund?.entity?.id },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      received: true,
      event,
      eventId,
    });
  } catch (error: any) {
    console.error('Error processing payment webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error processing payment webhook' },
      { status: 500 }
    );
  }
}
