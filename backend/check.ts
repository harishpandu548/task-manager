import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log(`- ${u.email} (Active: ${u.isActive}, ID: ${u.id})`);
    const match = await bcrypt.compare('password123', u.password);
    console.log(`  Password 'password123' matches hash? ${match}`);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
