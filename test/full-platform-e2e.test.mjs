import assert from 'node:assert';
import test from 'node:test';
import crypto from 'node:crypto';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

test('AHCS Full Platform E2E Test Suite (Phases J, K, L, M, N)', async (t) => {
  let officerCookie = '';
  let citizenCookie = '';
  let citizenAccountId = '';
  let citizenClientId = '';
  let newProviderId = '';
  let createdConsentId = '';
  let paymentOrderId = '';
  let corporateOrgId = '';

  await t.test('1. Verified Provider Directory Search', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/providers?category=HOSPITAL`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.providers.length >= 1, 'Should have at least 1 verified hospital');
    assert.strictEqual(data.providers[0].status, 'VERIFIED');
  });

  await t.test('2. Provider Registration Application', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Apex Super Specialty Care',
        category: 'HOSPITAL',
        registrationNumber: `KA-MED-APEX-${Date.now().toString().slice(-4)}`,
        medicalCouncil: 'Karnataka Medical Council',
        address: '100 Outer Ring Road, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560103',
        phone: '+91 80 9988 7766',
        email: 'admin@apexhealth.in',
        services: ['Critical Care', 'Neuro Surgery', '24x7 Trauma'],
      }),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.provider.status, 'PENDING_VERIFICATION');
    newProviderId = data.provider.id;
  });

  await t.test('3. Verification Officer Session Login & Provider Credential Approval', async () => {
    // 3a. Officer OTP
    const otpRes = await fetch(`${BASE_URL}/api/v1/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: '+919999900001' }),
    });
    const otpData = await otpRes.json();

    const verifyRes = await fetch(`${BASE_URL}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: '+919999900001', code: otpData.devCode }),
    });

    assert.strictEqual(verifyRes.status, 200);
    const cookies = verifyRes.headers.get('set-cookie');
    assert(cookies, 'Officer should receive session cookie');
    officerCookie = cookies.split(';')[0];

    // 3b. Officer approves provider credentials
    const decisionRes = await fetch(`${BASE_URL}/api/v1/officer/provider-decision`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': officerCookie,
      },
      body: JSON.stringify({
        providerId: newProviderId,
        decision: 'VERIFY',
        reviewNotes: 'Medical registration certificate confirmed with KMC portal',
      }),
    });

    assert.strictEqual(decisionRes.status, 200);
    const decisionData = await decisionRes.json();
    assert.strictEqual(decisionData.provider.status, 'VERIFIED');
  });

  await t.test('4. Citizen Account Creation, Profile & Officer Approval Flow', async () => {
    const citizenMobile = `+9198${Date.now().toString().slice(-8)}`;
    
    // OTP Send & Verify
    const otpRes = await fetch(`${BASE_URL}/api/v1/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: citizenMobile }),
    });
    const otpData = await otpRes.json();

    const verifyRes = await fetch(`${BASE_URL}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: citizenMobile, code: otpData.devCode }),
    });
    assert.strictEqual(verifyRes.status, 200);
    citizenCookie = verifyRes.headers.get('set-cookie').split(';')[0];

    // Profile Setup
    const uniqueSuffix = Date.now().toString().slice(-4);
    const testName = `Rohit Deshmukh ${uniqueSuffix}`;

    const profileRes = await fetch(`${BASE_URL}/api/v1/profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': citizenCookie,
      },
      body: JSON.stringify({
        fullName: testName,
        dateOfBirth: '1992-06-15',
        gender: 'MALE',
        bloodGroup: 'O_POS',
        addressLine1: 'Flat 402, Greenview Heights',
        district: 'Bengaluru Urban',
        stateProvince: 'Karnataka',
        pinCode: '560034',
        emergencyContactName: 'Sunita Deshmukh',
        emergencyContactPhone: `+91987${Date.now().toString().slice(-7)}`,
        emergencyContactRelation: 'SPOUSE',
      }),
    });
    assert.strictEqual(profileRes.status, 200);

    // Document KYC Submission
    const submitRes = await fetch(`${BASE_URL}/api/v1/verification/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': citizenCookie,
      },
      body: JSON.stringify({
        docType: 'PASSPORT',
        docNumber: `P${Date.now()}`,
        fileName: 'documents/passport_scan_e2e.pdf',
        fileSizeBytes: 204800,
      }),
    });
    assert.strictEqual(submitRes.status, 200);
    const submitData = await submitRes.json();
    const ticketId = submitData.verificationRequestId || submitData.verificationRequest?.id;

    // Officer Approves Citizen
    const approvalRes = await fetch(`${BASE_URL}/api/v1/officer/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': officerCookie,
      },
      body: JSON.stringify({
        verificationRequestId: ticketId,
        decision: 'APPROVE',
        notes: 'Documents verified clean for full platform test',
      }),
    });
    assert.strictEqual(approvalRes.status, 200);
    const approvalData = await approvalRes.json();
    citizenClientId = approvalData.clientId;
    assert(citizenClientId.startsWith('AHCS-'), 'Should mint valid AHCS Client ID');

    // Citizen Session Lookup
    const meRes = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: { 'Cookie': citizenCookie },
    });
    const meData = await meRes.json();
    citizenAccountId = meData.account.id;

    // Activate Card
    const activateRes = await fetch(`${BASE_URL}/api/v1/cards/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': citizenCookie,
      },
      body: JSON.stringify({ activationCode: approvalData.activationCode }),
    });
    assert.strictEqual(activateRes.status, 200);
  });

  await t.test('5. Doctor Patient Lookup: Privacy Guard Blocks Record Access without Consent', async () => {
    const lookupRes = await fetch(`${BASE_URL}/api/v1/provider/patient-lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: citizenClientId,
        providerId: newProviderId,
        doctorName: 'Dr. Arjun Kulkarni, MS',
      }),
    });

    assert.strictEqual(lookupRes.status, 200);
    const data = await lookupRes.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.hasConsent, false, 'Should be restricted by Consent Guard');
    assert(data.patient.fullName.includes('Rohit Deshmukh'), 'Patient name should match');
    assert.strictEqual(data.records, undefined, 'Records MUST NOT be returned without consent');
  });

  await t.test('6. Doctor Requests Consent -> Citizen Approves for 24 Hours', async () => {
    // 6a. Doctor requests consent
    const requestRes = await fetch(`${BASE_URL}/api/v1/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'REQUEST',
        clientId: citizenClientId,
        providerId: newProviderId,
        providerName: 'Apex Super Specialty Care',
        doctorName: 'Dr. Arjun Kulkarni, MS',
        purpose: 'DIAGNOSIS',
        scope: 'ALL_RECORDS',
      }),
    });

    assert.strictEqual(requestRes.status, 201);
    const requestData = await requestRes.json();
    assert.strictEqual(requestData.consent.status, 'REQUESTED');
    createdConsentId = requestData.consent.id;

    // 6b. Citizen inspects consent requests
    const listRes = await fetch(`${BASE_URL}/api/v1/consent`, {
      headers: { 'Cookie': citizenCookie },
    });
    const listData = await listRes.json();
    assert(listData.consents.some(c => c.id === createdConsentId));

    // 6c. Citizen grants consent
    const grantRes = await fetch(`${BASE_URL}/api/v1/consent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': citizenCookie,
      },
      body: JSON.stringify({
        action: 'RESPOND',
        consentId: createdConsentId,
        decision: 'GRANT',
        durationHours: 24,
      }),
    });

    assert.strictEqual(grantRes.status, 200);
    const grantData = await grantRes.json();
    assert.strictEqual(grantData.consent.status, 'GRANTED');
  });

  await t.test('7. Doctor Accesses Patient History with Active Consent & Authors Clinical Prescription', async () => {
    // 7a. Lookup now succeeds with full clinical records
    const lookupRes = await fetch(`${BASE_URL}/api/v1/provider/patient-lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: citizenClientId,
        providerId: newProviderId,
        doctorName: 'Dr. Arjun Kulkarni, MS',
      }),
    });

    assert.strictEqual(lookupRes.status, 200);
    const lookupData = await lookupRes.json();
    assert.strictEqual(lookupData.hasConsent, true, 'Active consent must allow clinical view');
    assert.strictEqual(lookupData.patient.bloodGroup, 'O_POS');

    // 7b. Doctor writes Clinical Encounter & Prescription
    const recordRes = await fetch(`${BASE_URL}/api/v1/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: citizenAccountId,
        authorProviderId: newProviderId,
        authorProviderName: 'Apex Super Specialty Care',
        authorDoctorName: 'Dr. Arjun Kulkarni, MS',
        recordType: 'PRESCRIPTION',
        title: 'Outpatient Consultation: Acute Gastritis',
        clinicalDiagnosis: 'Acute Gastritis with Epigastric Pain',
        clinicalNotes: 'Advised bland diet, adequate hydration and follow up in 5 days.',
        medications: [
          { medicineName: 'Pantoprazole', dosage: '40mg', frequency: '1-0-0 (Before food)', duration: '14 days' },
          { medicineName: 'Sucralfate Syrup', dosage: '10ml', frequency: '1-1-1 (Before food)', duration: '7 days' },
        ],
      }),
    });

    assert.strictEqual(recordRes.status, 201);
    const recordData = await recordRes.json();
    assert.strictEqual(recordData.record.medications.length, 2);

    // 7c. Citizen views the new prescription in their dashboard
    const citizenRecordsRes = await fetch(`${BASE_URL}/api/v1/records`, {
      headers: { 'Cookie': citizenCookie },
    });
    const citizenRecordsData = await citizenRecordsRes.json();
    assert.strictEqual(citizenRecordsData.records.length, 1);
    assert.strictEqual(citizenRecordsData.records[0].medications[0].medicineName, 'Pantoprazole');
  });

  await t.test('8. Citizen Instant One-Click Revocation: Doctor Access Immediately Blocked', async () => {
    // 8a. Citizen revokes consent
    const revokeRes = await fetch(`${BASE_URL}/api/v1/consent/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': citizenCookie,
      },
      body: JSON.stringify({ consentId: createdConsentId }),
    });

    assert.strictEqual(revokeRes.status, 200);
    const revokeData = await revokeRes.json();
    assert.strictEqual(revokeData.consent.status, 'REVOKED');

    // 8b. Doctor tries to access records again -> Gated!
    const doctorLookupRes = await fetch(`${BASE_URL}/api/v1/provider/patient-lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: citizenClientId,
        providerId: newProviderId,
        doctorName: 'Dr. Arjun Kulkarni, MS',
      }),
    });

    const doctorLookupData = await doctorLookupRes.json();
    assert.strictEqual(doctorLookupData.hasConsent, false, 'Doctor must be blocked immediately following revocation');
    assert.strictEqual(doctorLookupData.records, undefined);
  });

  await t.test('9. Corporate Health Sponsorship & Strict Clinical Privacy Separation', async () => {
    // 9a. Register Corporate Org
    const regOrgRes = await fetch(`${BASE_URL}/api/v1/corporate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'REGISTER_ORG',
        orgName: 'Acme Technologies Pvt Ltd',
        registrationNumber: 'U72200KA2021PTC145678',
        contactEmail: 'benefits@acme.com',
        contactPhone: '+91 80 4455 6677',
        domain: 'acme.com',
      }),
    });

    assert.strictEqual(regOrgRes.status, 201);
    const regOrgData = await regOrgRes.json();
    corporateOrgId = regOrgData.organization.id;

    // 9b. Sponsor citizen's AHCS Card
    const sponsorRes = await fetch(`${BASE_URL}/api/v1/corporate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SPONSOR_EMPLOYEE',
        orgId: corporateOrgId,
        employeeId: 'ACME-E-4421',
        clientId: citizenClientId,
      }),
    });

    assert.strictEqual(sponsorRes.status, 201);

    // 9c. Verify Corporate Admin Query has NO ACCESS to private medical records or emergency dataset
    const orgQueryRes = await fetch(`${BASE_URL}/api/v1/corporate?orgId=${corporateOrgId}`);
    assert.strictEqual(orgQueryRes.status, 200);
    const orgQueryData = await orgQueryRes.json();
    assert.strictEqual(orgQueryData.sponsoredMembersCount, 1);
    assert.strictEqual(orgQueryData.members[0].employeeId, 'ACME-E-4421');
    assert.strictEqual(orgQueryData.members[0].bloodGroup, undefined, 'Corporate must NOT receive blood group');
    assert.strictEqual(orgQueryData.members[0].medicalRecords, undefined, 'Corporate must NOT receive medical records');
    assert(orgQueryData.privacyNotice.includes('strictly restricted'));
  });

  await t.test('10. Subscription Order Creation & Cryptographic Signature Verification', async () => {
    // 10a. Create order
    const createOrderRes = await fetch(`${BASE_URL}/api/v1/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': citizenCookie,
      },
      body: JSON.stringify({
        planId: 'AHCS-PLAN-PREMIUM',
        planName: 'Smart Physical Card & Family Shield',
        amountPaise: 219900,
        gateway: 'RAZORPAY',
      }),
    });

    assert.strictEqual(createOrderRes.status, 201);
    const orderData = await createOrderRes.json();
    paymentOrderId = orderData.order.id;
    assert.strictEqual(orderData.order.amount, 219900);

    // 10b. Verify payment
    const gatewayPaymentId = `pay_test_${Date.now()}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'ahcs_prod_webhook_secret_hmac';
    const gatewaySignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderData.order.gatewayOrderId}|${gatewayPaymentId}`)
      .digest('hex');

    const verifyPayRes = await fetch(`${BASE_URL}/api/v1/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': citizenCookie,
      },
      body: JSON.stringify({
        orderId: paymentOrderId,
        gatewayOrderId: orderData.order.gatewayOrderId,
        gatewayPaymentId,
        gatewaySignature,
      }),
    });

    assert.strictEqual(verifyPayRes.status, 200);
    const verifyPayData = await verifyPayRes.json();
    assert.strictEqual(verifyPayData.order.status, 'PAID');
    assert(verifyPayData.order.paidAt, 'paidAt must be recorded');
  });
});
