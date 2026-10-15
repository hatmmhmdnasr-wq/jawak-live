const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const gifts = [
    { name: 'heart', price: 50, imageUrl: '' },
    { name: 'flower', price: 100, imageUrl: '' },
    { name: 'crown', price: 500, imageUrl: '' }
  ];

  for (const g of gifts) {
    await prisma.gift.upsert({
      where: { name: g.name },
      update: {},
      create: g
    });
  }

  await prisma.user.upsert({
    where: { email: 'admin@jawak.test' },
    update: {},
    create: {
      email: 'admin@jawak.test',
      passwordHash: '$2b$10$examplehashnotused',
      displayName: 'Admin',
      coins: 1000,
      isAdmin: true
    }
  });

  console.log('Seeded successfully');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
