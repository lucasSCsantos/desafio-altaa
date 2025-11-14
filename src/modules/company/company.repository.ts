import prisma from '@/lib/prisma';

const PAGE_SIZE = 6;

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
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
}
