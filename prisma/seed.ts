import { Role } from '@/generated/prisma/enums';
import prisma from '../src/lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
  console.log('🌱 Starting seed...');

  const USERS_COUNT = 5;
  const users = [];

  for (let i = 0; i < USERS_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: i === 0 ? 'email@teste.com' : faker.internet.email().toLowerCase(),
        password: process.env.FAKER_PASSWORD_HASH,
      },
    });

    users.push(user);
  }

  console.log(`👤 Created ${users.length} users`);

  const COMPANIES_COUNT = 3;

  for (let i = 0; i < COMPANIES_COUNT; i++) {
    const owner = faker.helpers.arrayElement(users);

    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
        logo: faker.internet.emoji(),
        ownerId: owner.id,
      },
    });

    console.log(`🏢 Created company: ${company.name}`);

    await prisma.membership.create({
      data: {
        userId: owner.id,
        companyId: company.id,
        role: Role.OWNER,
      },
    });

    const memberCount = faker.number.int({ min: 2, max: 4 });
    const otherUsers = users.filter((u) => u.id !== owner.id);

    const pickedMembers = faker.helpers.arrayElements(otherUsers, memberCount);

    for (const member of pickedMembers) {
      await prisma.membership.create({
        data: {
          userId: member.id,
          companyId: company.id,
          role: faker.helpers.arrayElement([Role.ADMIN, Role.MEMBER]),
        },
      });
    }
  }

  console.log('🏢 Companies, memberships, and invites seeded.');

  const allCompanies = await prisma.company.findMany();

  for (const user of users) {
    const randomCompany = faker.helpers.arrayElement(allCompanies);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        activeCompanyId: randomCompany.id,
      },
    });
  }

  console.log('🔗 Users active companies set.');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
