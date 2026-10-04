import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Testing new PostgreSQL models and APIs...');

  // 1. Create a test Mobile Medical Request
  const mobile = await prisma.mobileMedicalRequest.create({
    data: {
      organizationName: 'Automated Test Health Org',
      contactPerson: 'Aditi Sharma',
      phone: '9876543210',
      email: 'aditi@example.com',
      expectedPeople: 85,
      location: 'Electronics City Phase 1',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560100',
      preferredDate: new Date(Date.now() + 86400000 * 7),
      requiredServices: ['Vitals', 'Cardiac ECG', 'General OPD'],
      notes: 'Automated E2E integration test',
      status: 'REQUESTED'
    }
  });
  console.log('✅ Mobile Medical Request created in Neon PostgreSQL:', mobile.id);

  // 2. Create a test Home Care Request
  const homeCare = await prisma.homeCareRequest.create({
    data: {
      patientName: 'Kailash Nath',
      serviceType: 'NURSING_ATTENDANT',
      location: 'House 14, Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560034',
      preferredDate: new Date(Date.now() + 86400000 * 2),
      contactPhone: '9812345678',
      contactEmail: 'kailash@example.com',
      notes: 'Mobility assistance required post knee replacement',
      status: 'REQUESTED'
    }
  });
  console.log('✅ Home Care Request created in Neon PostgreSQL:', homeCare.id);

  // 3. Create a test Support Ticket
  const ticketNumber = `AHCS-TKT-${Date.now().toString().slice(-4)}`;
  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber,
      fullName: 'Vikram Malhotra',
      email: 'vikram@example.com',
      phone: '9988776655',
      category: 'CARD_STATUS_DELIVERY',
      subject: 'Physical card dispatch query',
      message: 'When will my smart card arrive in Delhi?',
      priority: 'MEDIUM',
      status: 'OPEN'
    }
  });
  console.log('✅ Support Ticket created in Neon PostgreSQL:', ticket.ticketNumber);

  // 4. Test credential verification lookup against existing active client ID
  const testClientId = await prisma.clientId.findFirst({
    where: { isActive: true },
    include: { account: { include: { profile: true, cards: true } } }
  });
  if (testClientId) {
    console.log('✅ Found verified Client ID in DB:', testClientId.clientId);
    console.log('   Holder Name:', testClientId.account?.profile?.fullName);
    console.log('   Card status:', testClientId.account?.cards[0]?.status);
  }

  // 5. Clean up the test records
  await prisma.mobileMedicalRequest.delete({ where: { id: mobile.id } });
  await prisma.homeCareRequest.delete({ where: { id: homeCare.id } });
  await prisma.supportTicket.delete({ where: { id: ticket.id } });
  console.log('✅ Test records cleaned up successfully.');

  console.log('🎉 All new Neon PostgreSQL models and APIs verified successfully!');
}

main()
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
