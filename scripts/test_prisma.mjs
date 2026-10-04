import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Connecting to Prisma...');
    const users = await prisma.user.findMany({ take: 5 });
    console.log('Successfully queried users from Neon PostgreSQL:', users.length);
    users.forEach(u => console.log('User:', u.id, u.role, u.mobileNumber));
  } catch (err) {
    console.error('Prisma query error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
