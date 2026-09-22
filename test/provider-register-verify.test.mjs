const BASE = 'http://localhost:3000';

async function testRegistrationAndVerification() {
  console.log('--- TEST: PROVIDER REGISTRATION & OFFICER VERIFICATION FLOW ---');

  // Step 1: Register New Clinic/Doctor
  const regPayload = {
    name: 'Apollo City Care Clinic',
    category: 'CLINIC',
    registrationNumber: 'REG-KA-2026-' + Date.now().toString().slice(-4),
    medicalCouncil: 'Karnataka Medical Council / NMC',
    phone: '+919876543210',
    email: 'contact@apollocitycare.org',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560001',
    address: '42 MG Road, Central District',
    services: ['General Consultation', 'Digital Prescriptions (Rx)'],
    operatingHours: '09:00 AM - 08:00 PM',
  };

  const regRes = await fetch(`${BASE}/api/v1/providers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  });

  const regData = await regRes.json();
  if (!regRes.ok || !regData.success) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }
  const providerId = regData.provider.id;
  console.log(`✔ Step 1: Clinic Registered successfully! ID: ${providerId}, Status: ${regData.provider.status}`);

  // Step 2: Officer Login
  const otpRes = await fetch(`${BASE}/api/v1/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: '+919999900001' }),
  });
  const otpData = await otpRes.json();
  const code = otpData.devCode;

  const offLoginRes = await fetch(`${BASE}/api/v1/auth/officer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      badgeId: 'OFFICER-DEL-01',
      mobileNumber: '+919999900001',
      code,
    }),
  });
  const offLoginData = await offLoginRes.json();
  const officerCookie = offLoginRes.headers.get('set-cookie');
  console.log(`✔ Step 2: Government Officer Authenticated! Badge: ${offLoginData.user?.badgeId}`);

  // Step 3: Check Pending Providers Queue
  const pendingRes = await fetch(`${BASE}/api/v1/providers?status=PENDING_VERIFICATION`);
  const pendingData = await pendingRes.json();
  const foundPending = pendingData.providers.find(p => p.id === providerId);
  if (!foundPending) {
    throw new Error('Registered facility not found in pending queue!');
  }
  console.log(`✔ Step 3: Pending Facility visible on Officer Console: "${foundPending.name}" (${foundPending.registrationNumber})`);

  // Step 4: Officer Verifies & Authorizes Facility
  const verifyRes = await fetch(`${BASE}/api/v1/officer/provider-decision`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': officerCookie || '',
    },
    body: JSON.stringify({
      providerId,
      decision: 'VERIFY',
      reviewNotes: 'Valid license inspected against Karnataka Medical Council database. Authorized for AHCS clinical operations.',
    }),
  });
  const verifyData = await verifyRes.json();
  if (!verifyRes.ok || !verifyData.success) {
    throw new Error(`Facility verification failed: ${JSON.stringify(verifyData)}`);
  }
  console.log(`✔ Step 4: Facility Authorized by Officer! Status: ${verifyData.provider.status}`);

  // Step 5: Doctor/Staff Logs in under this newly verified facility
  const staffOtpRes = await fetch(`${BASE}/api/v1/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: '+919888877777' }),
  });
  const staffOtpData = await staffOtpRes.json();

  const staffLoginRes = await fetch(`${BASE}/api/v1/auth/provider/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      providerId,
      mobileNumber: '+919888877777',
      code: staffOtpData.devCode,
      doctorName: 'Dr. Sameer Kapoor, MBBS',
      medicalCouncilNumber: 'KMC-2022-81729',
      staffRole: 'DOCTOR',
    }),
  });
  const staffLoginData = await staffLoginRes.json();
  if (!staffLoginRes.ok || !staffLoginData.success) {
    throw new Error(`Staff login failed under newly verified facility: ${JSON.stringify(staffLoginData)}`);
  }
  console.log(`✔ Step 5: Doctor Authenticated under newly verified facility! Staff ID: ${staffLoginData.staff.id}`);

  console.log('🎉 ALL REGISTRATION & VERIFICATION CHECKS PASSED!');
}

testRegistrationAndVerification().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
