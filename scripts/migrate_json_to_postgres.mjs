import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function safeDate(val) {
  if (!val) return new Date();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

function safeNullableDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

async function migrate() {
  console.log('--- Starting Migration from JSON to Neon PostgreSQL ---');

  if (!fs.existsSync('data/ahcs_production.json')) {
    console.log('No data/ahcs_production.json found. Skipping migration.');
    return;
  }

  const raw = fs.readFileSync('data/ahcs_production.json', 'utf8');
  const data = JSON.parse(raw);

  // 1. Users
  console.log(`Migrating ${data.users?.length || 0} users...`);
  for (const u of data.users || []) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        mobileNumber: u.mobileNumber,
        email: u.email || null,
        role: u.role,
        status: u.status,
      },
      create: {
        id: u.id,
        mobileNumber: u.mobileNumber,
        mobileVerifiedAt: safeNullableDate(u.mobileVerifiedAt),
        email: u.email || null,
        emailVerifiedAt: safeNullableDate(u.emailVerifiedAt),
        role: u.role,
        status: u.status,
        authProvider: u.authProvider || 'MOBILE_OTP',
        googleSub: u.googleSub || null,
        createdAt: safeDate(u.createdAt),
        updatedAt: safeDate(u.updatedAt || u.createdAt),
      },
    });
  }

  // 2. Accounts
  console.log(`Migrating ${data.accounts?.length || 0} accounts...`);
  for (const a of data.accounts || []) {
    await prisma.account.upsert({
      where: { id: a.id },
      update: { state: a.state },
      create: {
        id: a.id,
        userId: a.userId,
        accountNumber: a.accountNumber,
        state: a.state,
        createdAt: safeDate(a.createdAt),
        updatedAt: safeDate(a.updatedAt || a.createdAt),
      },
    });
  }

  // 3. Profiles
  console.log(`Migrating ${data.profiles?.length || 0} profiles...`);
  for (const p of data.profiles || []) {
    await prisma.profile.upsert({
      where: { accountId: p.accountId },
      update: {
        fullName: p.fullName,
        bloodGroup: p.bloodGroup,
        bloodGroupSource: p.bloodGroupSource || 'UNKNOWN',
      },
      create: {
        id: p.id,
        accountId: p.accountId,
        fullName: p.fullName,
        dateOfBirth: safeDate(p.dateOfBirth),
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        bloodGroupSource: p.bloodGroupSource || 'UNKNOWN',
        addressLine1: p.addressLine1 || null,
        addressLine2: p.addressLine2 || null,
        district: p.district,
        stateProvince: p.stateProvince,
        pinCode: p.pinCode,
        emergencyContactName: p.emergencyContactName || null,
        emergencyContactPhone: p.emergencyContactPhone || null,
        emergencyContactRelation: p.emergencyContactRelation || null,
        createdAt: safeDate(p.createdAt),
        updatedAt: safeDate(p.updatedAt || p.createdAt),
      },
    });
  }

  // 4. Verification Requests
  console.log(`Migrating ${data.verificationRequests?.length || 0} verification requests...`);
  for (const vr of data.verificationRequests || []) {
    await prisma.verificationRequest.upsert({
      where: { id: vr.id },
      update: { status: vr.status },
      create: {
        id: vr.id,
        accountId: vr.accountId,
        status: vr.status,
        duplicateCheckResult: vr.duplicateCheckResult || 'NO_MATCH',
        duplicateScore: vr.duplicateScore || 0,
        duplicateMatchDetails: vr.duplicateMatchDetails || {},
        assignedOfficerId: vr.assignedOfficerId || null,
        reviewNotes: vr.reviewNotes || null,
        reviewedAt: safeNullableDate(vr.reviewedAt),
        createdAt: safeDate(vr.createdAt),
        updatedAt: safeDate(vr.updatedAt || vr.createdAt),
      },
    });
  }

  // 5. Verification Documents
  console.log(`Migrating ${data.verificationDocuments?.length || 0} verification documents...`);
  for (const vd of data.verificationDocuments || []) {
    await prisma.verificationDocument.upsert({
      where: { id: vd.id },
      update: { status: vd.status },
      create: {
        id: vd.id,
        verificationRequestId: vd.verificationRequestId,
        documentType: vd.documentType,
        documentNumberHash: vd.documentNumberHash,
        documentNumberMasked: vd.documentNumberMasked,
        s3ObjectKey: vd.s3ObjectKey,
        fileMimeType: vd.fileMimeType,
        fileSizeBytes: vd.fileSizeBytes,
        status: vd.status,
        verificationNotes: vd.verificationNotes || null,
        verifiedBy: vd.verifiedBy || null,
        verifiedAt: safeNullableDate(vd.verifiedAt),
        createdAt: safeDate(vd.createdAt),
      },
    });
  }

  // 6. Client IDs
  console.log(`Migrating ${data.clientIds?.length || 0} client IDs...`);
  for (const cid of data.clientIds || []) {
    await prisma.clientId.upsert({
      where: { accountId: cid.accountId },
      update: { clientId: cid.clientId, isActive: cid.isRevoked !== true },
      create: {
        id: cid.id,
        accountId: cid.accountId,
        clientId: cid.clientId,
        checksum: cid.checksum,
        isActive: cid.isRevoked !== true,
        issuedAt: safeDate(cid.createdAt),
      },
    });
  }

  // 7. Cards
  console.log(`Migrating ${data.cards?.length || 0} cards...`);
  for (const c of data.cards || []) {
    await prisma.card.upsert({
      where: { id: c.id },
      update: { status: c.status },
      create: {
        id: c.id,
        clientIdFk: c.clientIdFk,
        accountId: c.accountId,
        cardNumber: c.cardNumber,
        version: c.version || 1,
        status: c.status,
        activationCodeHash: c.activationCodeHash,
        activatedAt: safeNullableDate(c.activatedAt),
        activatedByUserId: c.activatedByUserId || null,
        expiresAt: safeDate(c.expiresAt),
        createdAt: safeDate(c.createdAt),
      },
    });
  }

  // 8. QR Tokens
  console.log(`Migrating ${data.qrTokens?.length || 0} QR tokens...`);
  for (const qt of data.qrTokens || []) {
    await prisma.qrToken.upsert({
      where: { token: qt.tokenRaw },
      update: { isRevoked: qt.isRevoked },
      create: {
        id: qt.id,
        cardId: qt.cardId,
        token: qt.tokenRaw,
        tokenType: qt.tokenType || 'EMERGENCY_QR',
        isRevoked: qt.isRevoked || false,
        scanCount: BigInt(qt.scanCount || 0),
        lastScannedAt: safeNullableDate(qt.lastScannedAt),
        expiresAt: safeDate(qt.expiresAt),
        createdAt: safeDate(qt.createdAt),
      },
    });
  }

  // 9. Emergency Profiles
  console.log(`Migrating ${data.emergencyProfiles?.length || 0} emergency profiles...`);
  for (const ep of data.emergencyProfiles || []) {
    await prisma.emergencyProfile.upsert({
      where: { accountId: ep.accountId },
      update: {
        allergies: ep.allergies || [],
        criticalConditions: ep.criticalConditions || [],
        currentMedications: ep.currentMedications || [],
      },
      create: {
        id: ep.id,
        accountId: ep.accountId,
        isActive: ep.isActive !== false,
        allergies: ep.allergies || [],
        criticalConditions: ep.criticalConditions || [],
        currentMedications: ep.currentMedications || [],
        organDonor: ep.organDonor || false,
        preferredHospital: ep.preferredHospital || null,
        updatedAt: safeDate(ep.updatedAt || ep.createdAt),
      },
    });
  }

  // 10. Providers
  console.log(`Migrating ${data.providers?.length || 0} providers...`);
  for (const p of data.providers || []) {
    await prisma.provider.upsert({
      where: { registrationNumber: p.registrationNumber },
      update: { status: p.status },
      create: {
        id: p.id,
        name: p.name,
        category: p.category,
        registrationNumber: p.registrationNumber,
        medicalCouncil: p.medicalCouncil || 'State Medical Council',
        address: p.address,
        city: p.city,
        state: p.state,
        pinCode: p.pinCode,
        phone: p.phone,
        email: p.email,
        services: p.services || [],
        partnerTier: p.partnerTier || 'STANDARD',
        operatingHours: p.operatingHours || '24x7',
        status: p.status,
        verifiedAt: safeNullableDate(p.verifiedAt),
        createdAt: safeDate(p.createdAt),
        updatedAt: safeDate(p.updatedAt || p.createdAt),
      },
    });
  }

  // 11. Appointments
  console.log(`Migrating ${data.appointments?.length || 0} appointments...`);
  for (const appt of data.appointments || []) {
    try {
      await prisma.appointment.upsert({
        where: { id: appt.id },
        update: { status: appt.status || 'SCHEDULED' },
        create: {
          id: appt.id,
          accountId: appt.accountId,
          providerId: appt.providerId,
          doctorName: appt.doctorName || null,
          department: appt.department || null,
          scheduledAt: safeDate(appt.scheduledAt || appt.appointmentDate),
          status: appt.status || 'SCHEDULED',
          reason: appt.reason || null,
          notes: appt.notes || null,
          createdAt: safeDate(appt.createdAt),
        },
      });
    } catch (e) {
      // Skip if FK missing
    }
  }

  // 12. Benefit Rules
  console.log(`Migrating ${data.benefitRules?.length || 0} benefit rules...`);
  for (const br of data.benefitRules || []) {
    await prisma.benefitRule.upsert({
      where: { id: br.id },
      update: { discountPercent: br.discountPercent },
      create: {
        id: br.id,
        planId: br.planId,
        category: br.category,
        discountPercent: br.discountPercent || 0,
        maxDiscountPaise: br.maxDiscountPaise || 0,
        terms: br.terms || null,
        isActive: br.isActive !== false,
        createdAt: safeDate(br.createdAt),
      },
    });
  }

  console.log('✅ All core tables successfully migrated into Neon PostgreSQL!');
}

migrate()
  .catch(err => {
    console.error('❌ Migration Error:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
