import prisma from '@/lib/prisma';
import { SessionPayload } from '@/lib/auth';
import { ensureNotOwner, requireRole } from '@/lib/role-auth';
import { ApiError } from '@/lib/api-error';
import { Role } from '@/generated/prisma/enums';

interface UpdateMemberRoleParams {
  role: Role;
  userId: string;
}

interface DeleteMemberParams {
  userId: string;
}

export async function updateMemberRole(
  { role, userId: memberId }: UpdateMemberRoleParams,
  { userId, activeCompanyId }: SessionPayload,
) {
  await ensureNotOwner(memberId, activeCompanyId!);

  await requireRole(userId, activeCompanyId!, ['OWNER', 'ADMIN']);

  const member = await prisma.membership.update({
    where: {
      userId_companyId: {
        userId: memberId,
        companyId: activeCompanyId!,
      },
    },
    data: {
      role,
    },
  });

  if (!member) {
    throw new ApiError(409, 'ERROR_UPDATING_MEMBER', 'Não foi possível atualizar o membro');
  }

  return member;
}

export async function deleteMember(
  { activeCompanyId, userId }: SessionPayload,
  { userId: memberId }: DeleteMemberParams,
) {
  await ensureNotOwner(memberId, activeCompanyId!);

  await requireRole(userId, activeCompanyId!, ['OWNER', 'ADMIN']);

  const membership = await prisma.membership.deleteMany({
    where: {
      userId: memberId,
      companyId: activeCompanyId!,
    },
  });

  if (membership.count === 0) {
    throw new ApiError(409, 'ERROR_DELETING_MEMBER', 'Não foi possível deletar o membro');
  }

  return membership;
}
