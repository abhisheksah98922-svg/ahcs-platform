import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNeon() {
  console.log('Seeding initial system accounts into Neon PostgreSQL...');

  try {
    // 1. Verification Officer
    const officer = await prisma.user.upsert({
      where: { mobileNumber: '+919999900001' },
      update: {},
      create: {
        id: 'usr_officer_ananya_01',
        mobileNumber: '+919999900001',
        mobileVerifiedAt: new Date(),
        email: 'officer.ananya@ahcs.in',
        emailVerifiedAt: new Date(),
        role: 'VERIFICATION_OFFICER',
        status: 'ACTIVE',
        authProvider: 'MOBILE_OTP',
      },
    });
    console.log('✅ Officer account in Neon:', officer.id);

    // 2. Super Admin
    const admin = await prisma.user.upsert({
      where: { mobileNumber: '+919999900002' },
      update: {},
      create: {
        id: 'usr_admin_system_01',
        mobileNumber: '+919999900002',
        mobileVerifiedAt: new Date(),
        email: 'admin@ahcs.in',
        emailVerifiedAt: new Date(),
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        authProvider: 'MOBILE_OTP',
      },
    });
    console.log('✅ Admin account in Neon:', admin.id);

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedNeon();
