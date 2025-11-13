import prisma from '@/lib/prisma';

export async function findCompanyById(companyId: string) {
  return prisma.company.findUnique({ where: { id: companyId } });
}

export async function findCompanyMembers(companyId: string) {
  return prisma.membership.findMany({
    where: { companyId },
    include: { user: true },
  });
}

export async function findCompaniesByUserId(userId: string, page: number = 1) {
  return prisma.company.findMany({
    where: { memberships: { some: { userId } } },
    skip: (page - 1) * 6,
    take: 6,
  });
}
