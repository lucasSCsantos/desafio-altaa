import { Role } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';

export async function createMembership(userId: string, companyId: string, role: Role = 'MEMBER') {
  return prisma.membership.create({
    data: {
      userId,
      companyId,
      role: role,
    },
  });
}

export async function findMembership(userId: string, companyId: string) {
  return prisma.membership.findFirst({
    where: {
      userId,
      companyId,
    },
  });
}

export async function setInviteAccepted(inviteId: string) {
  return prisma.invite.update({
    where: { id: inviteId },
    data: { accepted: true },
  });
}
