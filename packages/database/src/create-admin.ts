import { PrismaClient, SystemRole, OrganizationRole, Plan, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const emailArg = args.find((a) => a.startsWith('--email='))?.split('=')[1] || 'admin@catalogfix.io';
  const passwordArg = args.find((a) => a.startsWith('--password='))?.split('=')[1] || 'Admin123!';
  const nameArg = args.find((a) => a.startsWith('--name='))?.split('=')[1] || 'Super Admin';

  console.log(`🔑 Creating or promoting Admin user: ${emailArg}...`);

  const pepper = process.env.PASSWORD_PEPPER || 'replace-with-random-pepper-value';
  const passwordHash = await bcrypt.hash(`${passwordArg}${pepper}`, 12);

  const user = await prisma.user.upsert({
    where: { email: emailArg },
    update: {
      systemRole: SystemRole.ADMIN,
      passwordHash,
      status: 'ACTIVE',
    },
    create: {
      email: emailArg,
      passwordHash,
      name: nameArg,
      systemRole: SystemRole.ADMIN,
      status: 'ACTIVE',
    },
  });

  console.log(`✅ User ${user.email} (ID: ${user.id}) is now a System ADMIN.`);

  // Ensure Admin has an organization
  const existingOrgMember = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  });

  if (!existingOrgMember) {
    const orgSlug = `admin-org-${Date.now().toString(36)}`;
    const org = await prisma.organization.create({
      data: {
        name: 'Admin Workspace',
        slug: orgSlug,
        members: {
          create: {
            userId: user.id,
            role: OrganizationRole.OWNER,
          },
        },
        subscription: {
          create: {
            plan: Plan.PRO,
            status: SubscriptionStatus.ACTIVE,
          },
        },
      },
    });
    console.log(`✅ Admin Workspace created: ${org.name} (${org.id})`);
  }

  console.log('\n🎉 Admin Creation Completed!');
  console.log('----------------------------------------------------');
  console.log(`Email:    ${emailArg}`);
  console.log(`Password: ${passwordArg}`);
  console.log(`Role:     ADMIN`);
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
