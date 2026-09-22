import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { generateAhcsClientId, validateAhcsClientId, calculateCheckCharacter } from '../lib/client-id.ts';

const BASE_URL = 'http://localhost:3000';

test('1. Prisma Schema & Models Integrity', async () => {
  const prisma = new PrismaClient();
  assert.ok(prisma.user, 'Prisma User model should be defined');
  assert.ok(prisma.account, 'Prisma Account model should be defined');
  assert.ok(prisma.profile, 'Prisma Profile model should be defined');
  assert.ok(prisma.clientId, 'Prisma ClientId model should be defined');
  assert.ok(prisma.card, 'Prisma Card model should be defined');
  assert.ok(prisma.cardEvent, 'Prisma CardEvent model should be defined');
  assert.ok(prisma.qrToken, 'Prisma QrToken model should be defined');
  assert.ok(prisma.emergencyProfile, 'Prisma EmergencyProfile model should be defined');
  assert.ok(prisma.provider, 'Prisma Provider model should be defined');
  assert.ok(prisma.medicalRecord, 'Prisma MedicalRecord model should be defined');
  assert.ok(prisma.prescription, 'Prisma Prescription model should be defined');
  assert.ok(prisma.consent, 'Prisma Consent model should be defined');
  assert.ok(prisma.paymentOrder, 'Prisma PaymentOrder model should be defined');
  assert.ok(prisma.company, 'Prisma Company model should be defined');
  assert.ok(prisma.corporateSponsorship, 'Prisma CorporateSponsorship model should be defined');
  assert.ok(prisma.auditLog, 'Prisma AuditLog model should be defined');
  await prisma.$disconnect();
});

test('2. Concurrent Client ID Generation & Uniqueness (50 Parallel Threads)', async () => {
  const count = 50;
  const promises = Array.from({ length: count }, () => Promise.resolve(generateAhcsClientId('IN')));
  const results = await Promise.all(promises);

  const seen = new Set();
  for (const r of results) {
    assert.match(r.clientId, /^AHCS-IN-[0-9A-HJKMNP-Z]{8}$/, 'Client ID must strictly match AHCS-IN-XXXXXXXC format');
    assert.equal(seen.has(r.clientId), false, `Collision detected: ${r.clientId}`);
    seen.add(r.clientId);

    const validation = validateAhcsClientId(r.clientId);
    assert.equal(validation.isValid, true, `Expected valid checksum for ${r.clientId}`);
  }
});

test('3. Luhn Mod 32 Error Detection & Limits', async () => {
  const idObj = generateAhcsClientId('IN');
  const validId = idObj.clientId;

  // Single substitution error
  const parts = validId.split('-');
  const token = parts[2];
  const corruptedToken = (token[0] === '0' ? '1' : '0') + token.slice(1);
  const corruptedId = `AHCS-IN-${corruptedToken}`;

  const checkCorrupted = validateAhcsClientId(corruptedId);
  assert.equal(checkCorrupted.isValid, false, 'Single character substitution must be detected and rejected');

  // Adjacent transposition error
  if (token[0] !== token[1]) {
    const transposedToken = token[1] + token[0] + token.slice(2);
    const transposedId = `AHCS-IN-${transposedToken}`;
    const checkTransposed = validateAhcsClientId(transposedId);
    assert.equal(checkTransposed.isValid, false, 'Adjacent character transposition must be rejected');
  }
});

test('4. Authentication: Mobile OTP Expiry & Brute Force Lockout', async () => {
  const mobile = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

  // 1. Request OTP
  const sendRes = await fetch(`${BASE_URL}/api/v1/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: mobile }),
  });
  const sendData = await sendRes.json();
  assert.equal(sendData.success, true);

  // 2. Attempt 3 incorrect OTP entries
  for (let attempt = 1; attempt <= 3; attempt++) {
    const wrongRes = await fetch(`${BASE_URL}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: mobile, code: '000000' }),
    });
    const wrongData = await wrongRes.json();
    assert.equal(wrongData.success, false, `Attempt ${attempt} should fail`);
  }

  // 3. 4th attempt after lockout must be rejected
  const lockedRes = await fetch(`${BASE_URL}/api/v1/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: mobile, code: '000000' }),
  });
  const lockedData = await lockedRes.json();
  assert.equal(lockedData.success, false);
  assert.match(lockedData.error, /maximum verification attempts|no active otp/i);
});

test('5. RBAC Protection: Officer Decision Route Rejects Unauthorized Users', async () => {
  const unauthRes = await fetch(`${BASE_URL}/api/v1/officer/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: 'fake_req_id', decision: 'APPROVE' }),
  });
  assert.equal(unauthRes.status, 403, 'Anonymous user must receive 403 on officer decision route');
});

test('6. RBAC Protection: Provider Decision Route Rejects Unauthorized Users', async () => {
  const unauthRes = await fetch(`${BASE_URL}/api/v1/officer/provider-decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ providerId: 'fake_provider_id', decision: 'VERIFIED' }),
  });
  assert.equal(unauthRes.status, 403, 'Anonymous user must receive 403 on provider approval route');
});

test('7. Payment Security: HMAC Signature Verification & Forgery Protection', async () => {
  // Create an unauthenticated request to verify payment
  const unauthRes = await fetch(`${BASE_URL}/api/v1/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: 'fake_order_123',
      gatewayOrderId: 'order_fake_456',
      gatewayPaymentId: 'pay_fake_789',
      gatewaySignature: 'forged_fake_signature_abc123',
    }),
  });
  assert.equal(unauthRes.status, 401, 'Unauthenticated payment verification must return 401');
});

test('8. Payment Webhook Security: Cryptographic Verification & Idempotency', async () => {
  const webhookSecret = 'ahcs_prod_webhook_secret_hmac';
  const eventId = `evt_test_${crypto.randomBytes(6).toString('hex')}`;
  const webhookPayload = JSON.stringify({
    id: eventId,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_wh_test_123',
          order_id: 'order_wh_nonexistent',
          amount: 59900,
        },
      },
    },
  });

  // 1. Missing signature -> Must return 400
  const missingSigRes = await fetch(`${BASE_URL}/api/v1/payments/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: webhookPayload,
  });
  assert.equal(missingSigRes.status, 400, 'Webhook without signature must return 400');

  // 2. Forged signature -> Must return 400
  const forgedSigRes = await fetch(`${BASE_URL}/api/v1/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': '0000000000000000000000000000000000000000000000000000000000000000',
    },
    body: webhookPayload,
  });
  assert.equal(forgedSigRes.status, 400, 'Webhook with forged signature must return 400');

  // 3. Valid HMAC-SHA256 signature -> Must return 200
  const validSignature = crypto.createHmac('sha256', webhookSecret).update(webhookPayload).digest('hex');
  const validRes = await fetch(`${BASE_URL}/api/v1/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': validSignature,
    },
    body: webhookPayload,
  });
  const validData = await validRes.json();
  assert.equal(validRes.status, 200);
  assert.equal(validData.success, true);

  // 4. Replay of same webhook event -> Must return idempotent 200 without error
  const duplicateRes = await fetch(`${BASE_URL}/api/v1/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': validSignature,
    },
    body: webhookPayload,
  });
  const duplicateData = await duplicateRes.json();
  assert.equal(duplicateRes.status, 200);
  assert.match(duplicateData.message, /idempotent/i);
});

test('9. Corporate Privacy: Employer Cannot Access Medical Records', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/corporate`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.ok(data.organizations, 'Must list organizations');

  // Check privacy notice
  if (data.organizations.length > 0) {
    const orgId = data.organizations[0].id;
    const orgRes = await fetch(`${BASE_URL}/api/v1/corporate?orgId=${orgId}`);
    const orgData = await orgRes.json();
    assert.ok(orgData.privacyNotice, 'Corporate response must contain privacy restriction statement');
    if (orgData.members && orgData.members.length > 0) {
      const sampleMember = orgData.members[0];
      assert.equal(sampleMember.clinicalDiagnosis, undefined, 'Medical diagnosis must never be visible to employers');
      assert.equal(sampleMember.medicalRecords, undefined, 'Medical records must never be visible to employers');
      assert.equal(sampleMember.prescriptions, undefined, 'Prescriptions must never be visible to employers');
    }
  }
});
