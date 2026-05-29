import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function activate() {
  const user = await prisma.user.update({
    where: { email: 'admin@taskflow.com' },
    data: { isActive: true },
  });
  console.log('Activated:', user.email, 'isActive:', user.isActive);
}

activate().catch(console.error).finally(() => prisma.$disconnect());
