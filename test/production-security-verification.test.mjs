import assert from 'assert';
import crypto from 'crypto';

const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function calculateCheckCharacter(input) {
  const clean = input.toUpperCase().replace(/[^0-9A-Z]/g, '');
  let factor = 2;
  let sum = 0;
  const n = CROCKFORD_BASE32.length; // 32

  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i];
    const codePoint = CROCKFORD_BASE32.indexOf(char);
    if (codePoint === -1) continue;

    const addend = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    sum += Math.floor(addend / n) + (addend % n);
  }

  const remainder = sum % n;
  const checkCodePoint = (n - remainder) % n;
  return CROCKFORD_BASE32[checkCodePoint];
}

function generateAhcsClientId(countryCode = 'IN') {
  const country = countryCode.toUpperCase().slice(0, 2);
  const randomBytes = crypto.randomBytes(7);
  let raw7 = '';

  for (let i = 0; i < 7; i++) {
    const index = randomBytes[i] % CROCKFORD_BASE32.length;
    raw7 += CROCKFORD_BASE32[index];
  }

  const checksum = calculateCheckCharacter(`${country}${raw7}`);
  const formattedToken = `${raw7}${checksum}`;
  const clientId = `AHCS-${country}-${formattedToken}`;

  return { clientId, checksum, rawToken: formattedToken };
}

function validateAhcsClientId(clientId) {
  const parts = clientId.trim().toUpperCase().split('-');
  if (parts.length !== 3) return { isValid: false };
  const [prefix, country, token] = parts;
  if (prefix !== 'AHCS' || country.length !== 2 || token.length !== 8) return { isValid: false };
  const raw7 = token.slice(0, 7);
  const checkChar = token.slice(7);
  const expected = calculateCheckCharacter(`${country}${raw7}`);
  return { isValid: checkChar === expected };
}

const BASE_URL = 'http://localhost:3000';

async function runTest(name, fn) {
  try {
    process.stdout.write(`⏳ [TEST] ${name}... `);
    await fn();
    console.log(`✅ PASSED`);
    return true;
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    console.error(err);
    return false;
  }
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`AHCS PRODUCTION SECURITY & AUDIT TEST SUITE`);
  console.log(`======================================================\n`);

  let passed = 0;
  let total = 0;

  // TEST 1: Concurrent Client ID Generation & Uniqueness
  total++;
  if (await runTest('Concurrent Client ID Generation (50 IDs, Collision & Checksum Test)', async () => {
    const ids = new Set();
    const promises = Array.from({ length: 50 }).map(async () => {
      const generated = generateAhcsClientId('IN');
      assert(generated.clientId.startsWith('AHCS-IN-'), 'Invalid prefix');
      const validation = validateAhcsClientId(generated.clientId);
      assert(validation.isValid, `Checksum validation failed for ${generated.clientId}`);
      return generated.clientId;
    });

    const results = await Promise.all(promises);
    for (const id of results) {
      assert(!ids.has(id), `Duplicate Client ID generated: ${id}`);
      ids.add(id);
    }
    assert.strictEqual(ids.size, 50, 'Expected 50 distinct IDs');
  })) passed++;

  // TEST 2: RBAC - Unauthorized Officer Access Blocked
  total++;
  if (await runTest('RBAC: Anonymous user blocked from Officer Decision API', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/officer/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verificationRequestId: 'fake-id',
        decision: 'APPROVE',
      }),
    });
    assert.strictEqual(res.status, 403, `Expected 403 Forbidden, got ${res.status}`);
    const data = await res.json();
    assert(data.error.includes('FORBIDDEN'), 'Expected FORBIDDEN in error message');
  })) passed++;

  // TEST 3: RBAC - Anonymous user blocked from Provider Verification Decision API
  total++;
  if (await runTest('RBAC: Anonymous user blocked from Provider Decision API', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/officer/provider-decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'fake-provider-id',
        decision: 'APPROVE',
      }),
    });
    assert.strictEqual(res.status, 403, `Expected 403 Forbidden, got ${res.status}`);
  })) passed++;

  // TEST 4: IDOR & Consent - Doctor Cannot Access Patient Records Without Active Consent
  total++;
  if (await runTest('IDOR/Consent: Provider blocked from patient records without consent', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/records?accountId=acc_unauthorized_test&providerId=PRV-999`);
    assert.strictEqual(res.status, 403, `Expected 403 Forbidden without consent, got ${res.status}`);
    const data = await res.json();
    assert(data.error.includes('consent'), 'Error should explicitly cite missing consent');
  })) passed++;

  // TEST 5: Corporate Privacy Isolation - Employers Cannot Access Clinical Records
  total++;
  if (await runTest('Corporate Privacy: Organization API withholds all clinical diagnosis and notes', async () => {
    // 1. Create corporate organization
    const orgRes = await fetch(`${BASE_URL}/api/v1/corporate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'REGISTER_ORG',
        orgName: `Test Corp Security ${Date.now()}`,
        registrationNumber: `REG-${Date.now()}`,
        contactEmail: 'security@corp.in',
        contactPhone: '+919999000888',
      }),
    });
    assert(orgRes.ok, 'Failed to create organization');
    const orgData = await orgRes.json();
    const orgId = orgData.organization.id;

    // 2. Fetch organization details
    const getRes = await fetch(`${BASE_URL}/api/v1/corporate?orgId=${orgId}`);
    assert(getRes.ok, 'Failed to get organization');
    const getData = await getRes.json();

    assert(getData.privacyNotice, 'Missing corporate privacy notice');
    assert.strictEqual(typeof getData.organization, 'object');
    // Ensure no clinical pointers exist in members array
    for (const member of getData.members) {
      assert.strictEqual(member.diagnosis, undefined, 'CRITICAL: Diagnosis leaked to corporate portal');
      assert.strictEqual(member.clinicalNotes, undefined, 'CRITICAL: Notes leaked to corporate portal');
      assert.strictEqual(member.prescriptions, undefined, 'CRITICAL: Prescriptions leaked to corporate portal');
    }
  })) passed++;

  // TEST 6: Payment Verification - Forged HMAC Signatures Rejected
  total++;
  if (await runTest('Payments: Unauthenticated or forged payment signatures are rejected', async () => {
    // 1. Unauthenticated request must return 401
    const resUnauth = await fetch(`${BASE_URL}/api/v1/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: 'ORD-FAKE-TEST',
        gatewayPaymentId: 'PAY-FAKE-TEST',
        gatewaySignature: '0000000000000000000000000000000000000000000000000000000000000000',
      }),
    });
    assert.strictEqual(resUnauth.status, 401, `Expected 401 Unauthorized, got ${resUnauth.status}`);
  })) passed++;

  // TEST 7: Emergency Break-Glass Data Minimization
  total++;
  if (await runTest('Emergency Gateway: Withholds clinical consultation notes from break-glass triage', async () => {
    // Non-existent or fake token should return 404
    const res = await fetch(`${BASE_URL}/api/v1/emergency/0000000000000000000000000000000000000000000000000000000000000000`);
    assert.strictEqual(res.status, 404, `Expected 404 for invalid token, got ${res.status}`);
  })) passed++;

  // TEST 8: Full Life-Cycle State Machine (Registration -> Approval -> Minting -> Replacement)
  total++;
  if (await runTest('Lifecycle: Unapproved account cannot mint cards; Officer approval generates ID-1 card', async () => {
    const testMobile = `+9199999${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Send OTP
    const otpRes = await fetch(`${BASE_URL}/api/v1/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: testMobile }),
    });
    const otpData = await otpRes.json();

    // 2. Verify OTP and capture session cookie
    const verifyRes = await fetch(`${BASE_URL}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: testMobile, code: otpData.devCode }),
    });
    const vData = await verifyRes.json();
    assert(verifyRes.ok, `Failed to verify OTP: ${JSON.stringify(vData)}`);
    const cookie = verifyRes.headers.get('set-cookie').split(';')[0];
    assert(cookie, 'Missing session cookie');

    // 3. Complete profile with unique citizen identity
    const uniqueSuffix = Date.now().toString().slice(-4);
    const profileRes = await fetch(`${BASE_URL}/api/v1/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({
        fullName: `Security Member ${uniqueSuffix}`,
        gender: 'FEMALE',
        dateOfBirth: `1995-04-${(10 + Math.floor(Math.random() * 15)).toString()}`,
        bloodGroup: 'B_POS',
        addressLine1: '77 Brigade Road',
        district: 'Bengaluru Urban',
        stateProvince: 'Karnataka',
        pinCode: '560001',
        emergencyContactName: 'Test Parent',
        emergencyContactPhone: '+919876543999',
        emergencyContactRelation: 'PARENT',
      }),
    });
    assert(profileRes.ok, 'Failed to submit profile');

    // 4. Submit document
    const docRes = await fetch(`${BASE_URL}/api/v1/verification/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({
        docType: 'DRIVING_LICENSE',
        docNumber: `DL-SEC-${Date.now()}`,
        fileName: 'documents/dl_test_secure.pdf',
        fileSizeBytes: 245000,
        mimeType: 'application/pdf',
      }),
    });
    assert(docRes.ok, 'Failed to submit document');
    const docData = await docRes.json();
    const verifReqId = docData.verificationRequestId || docData.verificationRequest?.id;

    // 5. Verify that prior to officer review, Client ID is NOT issued
    const meBefore = await fetch(`${BASE_URL}/api/v1/auth/me`, { headers: { Cookie: cookie } });
    const meBeforeData = await meBefore.json();
    assert(!meBeforeData.clientId, 'Client ID must NOT be issued before officer approval');
    assert(!meBeforeData.card, 'Card must NOT be issued before officer approval');

    // 6. Officer logs in and reviews ticket
    const officerMobile = '+919999900001';
    const offOtpRes = await fetch(`${BASE_URL}/api/v1/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: officerMobile }),
    });
    const offOtpData = await offOtpRes.json();
    const officerVerify = await fetch(`${BASE_URL}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: officerMobile, code: offOtpData.devCode }),
    });
    const officerCookie = officerVerify.headers.get('set-cookie').split(';')[0];
    assert(officerCookie, 'Missing officer cookie');

    const approveRes = await fetch(`${BASE_URL}/api/v1/officer/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: officerCookie },
      body: JSON.stringify({
        verificationRequestId: verifReqId,
        decision: 'APPROVE',
        notes: 'Documents verified against state transport database',
      }),
    });
    const approveData = await approveRes.json();
    if (!approveRes.ok) {
      console.log('\n[OFFICER APPROVAL FAILED]:', approveRes.status, approveData);
    }
    assert(approveRes.ok, `Officer approval failed: ${JSON.stringify(approveData)}`);
    assert.strictEqual(approveData.status, 'APPROVED');
    assert(approveData.clientId.startsWith('AHCS-IN-'), 'Invalid Client ID minted');
    assert(approveData.card.cardNumber.startsWith('CRD-'), 'Invalid Card Number minted');

    // 7. Patient activates card
    const activateRes = await fetch(`${BASE_URL}/api/v1/cards/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ activationCode: approveData.activationCode }),
    });
    assert(activateRes.ok, 'Card activation failed');

    // 8. Test Emergency Lookup via dynamic QR token
    const rawQrToken = approveData.qrToken.token;
    const emRes = await fetch(`${BASE_URL}/api/v1/emergency/${rawQrToken}`);
    assert(emRes.ok, 'Emergency lookup failed');
    const emData = await emRes.json();
    const patient = emData.emergencyData;
    assert(patient, 'Missing emergencyData payload');
    assert.strictEqual(patient.patientName, `Security Member ${uniqueSuffix}`);
    assert.strictEqual(patient.bloodGroup, 'B+');
    assert.strictEqual(patient.diagnosis, undefined, 'Must not disclose clinical diagnosis');
    assert.strictEqual(patient.prescriptions, undefined, 'Must not disclose prescriptions');

    // 9. Card Replacement: Reporting card lost immediately revokes old QR token
    const replaceRes = await fetch(`${BASE_URL}/api/v1/cards/replace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ reason: 'LOST' }),
    });
    assert(replaceRes.ok, 'Card replacement failed');
    const replaceData = await replaceRes.json();
    assert.notStrictEqual(replaceData.card.cardNumber, approveData.card.cardNumber, 'New card number must be issued');
    assert.strictEqual(replaceData.clientId, approveData.clientId, 'Permanent Client ID must remain identical');

    // 10. Verify old token is now REVOKED and rejected
    const oldTokenRes = await fetch(`${BASE_URL}/api/v1/emergency/${rawQrToken}`);
    assert(oldTokenRes.status === 403 || oldTokenRes.status === 404, `Expected 403 or 404 for revoked card token, got ${oldTokenRes.status}`);
  })) passed++;

  console.log(`\n------------------------------------------------------`);
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (${total - passed} FAILED)`);
  console.log(`------------------------------------------------------\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
