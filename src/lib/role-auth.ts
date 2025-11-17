import { Role } from '@/generated/prisma/enums';
import prisma from './prisma';
import { ApiError } from './api-error';

export async function requireOwner(companyId: string, userId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true, ownerId: true },
  });

  if (!company) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Empresa não encontrada');
  }

  if (company.ownerId !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Usuário não é o proprietário da empresa');
  }

  return company;
}

export async function requireRole(userId: string, companyId: string, allowedRoles: Role[]) {
  const membership = await prisma.membership.findFirst({
    where: { userId, companyId },
    select: { role: true },
  });

  if (!membership) {
    throw new ApiError(403, 'FORBIDDEN', 'Usuário não é membro da empresa');
  }

  if (!allowedRoles.includes(membership.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'Usuário não tem permissão suficiente');
  }

  return membership;
}

export async function ensureNotOwner(memberId: string, companyId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId: memberId,
        companyId: companyId,
      },
    },
  });

  if (membership && membership.role === 'OWNER') {
    throw new ApiError(
      400,
      'CANNOT_MODIFY_OWNER',
      'Não é possível modificar o proprietário da empresa',
    );
  }
}

export async function requireCompanyMember(companyId: string, userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { companyId, userId },
  });

  if (!membership) {
    throw new ApiError(403, 'FORBIDDEN', 'Usuário não é membro da empresa');
  }

  return membership;
}
