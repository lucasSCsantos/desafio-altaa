import prisma from '@/lib/prisma';

export async function findCompanyById(companyId: string) {
  return prisma.company.findUnique({
    where: { id: companyId },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function findCompanyMembers(companyId: string) {
  return prisma.membership.findMany({
    where: { companyId },
    include: { user: true },
  });
}

export async function findCompaniesByUserId(
  userId: string,
  page: number = 1,
  pageSize: number = 6,
) {
  return prisma.company.findMany({
    where: { memberships: { some: { userId } } },
    include: {
      _count: {
        select: { memberships: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export async function countCompaniesByUserId(userId: string) {
  return prisma.company.count({
    where: { memberships: { some: { userId } } },
  });
}
