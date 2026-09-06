const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users...');

  // Admin user
  const adminPassword = await bcrypt.hash('ADMIN_PASS_123', 10);
  const adminUser = await prisma.user.upsert({
    where: { branch: 'ADMIN' },
    update: {},
    create: {
      branch: 'ADMIN',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });
  console.log(`Created admin user with branch: ${adminUser.branch}`);

  // Member user
  const memberPassword = await bcrypt.hash('YES05', 10);
  const memberUser = await prisma.user.upsert({
    where: { branch: '05NO' },
    update: {},
    create: {
      branch: '05NO',
      passwordHash: memberPassword,
      role: 'member',
    },
  });
  console.log(`Created member user with branch: ${memberUser.branch}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
