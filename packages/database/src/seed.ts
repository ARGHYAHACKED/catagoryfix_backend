import { PrismaClient, Plan, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.organization.findUnique({ where: { slug: 'demo-not-used' } });
  if (existing) {
    return;
  }
  // Seed does not create login users. Plans exist as enum values only.
  console.log('CatalogFix seed: no demo users created. Register via the API.');
  void Plan.FREE;
  void SubscriptionStatus.ACTIVE;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
