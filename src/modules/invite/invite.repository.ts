import prisma from '@/lib/prisma';

// export async function createInvite(companyId: string, email: string, token: string) {
//   return prisma.invite.create({
//     data: {
//       companyId,
//       email,
//       token,
//     },
//   });
// }

export async function findInviteByToken(token: string) {
  return prisma.invite.findUnique({
    where: { token },
  });
}

export async function setInviteAccepted(inviteId: string) {
  return prisma.invite.update({
    where: { id: inviteId },
    data: { accepted: true },
  });
}
