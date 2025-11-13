import prisma from '@/lib/prisma';

// export async function createUser(email: string, name: string, password: string) {
//   return prisma.user.create({
//     data: {
//       email,
//       name,
//       password,
//     },
//   });
// }

export async function findUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email } });
}
