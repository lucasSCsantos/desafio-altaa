import prisma from '@/lib/prisma';
import {
  countCompaniesByUserId,
  findCompaniesByUserId,
  findCompanyById,
} from './company.repository';
import { setUserActiveCompany } from '../user/user.repository';
import { SessionPayload, signJWT } from '@/lib/auth';
import { requireCompanyMember, requireOwner } from '@/lib/role-auth';
import { ApiError } from '@/lib/api-error';

interface CreateCompanyParams {
  name: string;
  logo: string;
}

interface ListCompaniesParams {
  userId: string;
}

const PAGE_SIZE = 6;

export async function createCompany(
  { name, logo }: CreateCompanyParams,
  { userId }: SessionPayload,
) {
  const company = await prisma.company.create({
    data: {
      name,
      logo,
      ownerId: userId,
    },
  });

  if (!company) {
    throw new ApiError(400, 'ERROR_CREATING_COMPANY', 'Não foi possível criar a empresa');
  }

  await prisma.membership.create({
    data: {
      userId,
      companyId: company.id,
      role: 'OWNER',
    },
  });

  return company;
}

export async function listCompanies({ userId }: ListCompaniesParams, page: number = 1) {
  const companies = await findCompaniesByUserId(userId, page);
  const total = await countCompaniesByUserId(userId);

  return {
    total,
    companies: companies.map((company) => ({
      ...company,
      membersCount: company._count.memberships,
    })),
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function selectCompany({ userId }: SessionPayload, companyId: string) {
  await requireCompanyMember(companyId, userId);

  const company = await findCompanyById(companyId);

  if (!company) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'A empresa não existe ou foi removida');
  }

  const user = await setUserActiveCompany(userId, companyId);

  if (!user) {
    throw new ApiError(409, 'ERROR_SELECTING_COMPANY', 'Não foi possível selecionar a empresa');
  }

  const token = signJWT({
    userId,
    activeCompanyId: company.id,
  });

  return token;
}

export async function getCompany({ activeCompanyId, userId }: SessionPayload) {
  await requireCompanyMember(activeCompanyId!, userId);

  const company = await findCompanyById(activeCompanyId!);

  if (!company) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'A empresa não existe ou foi removida');
  }

  return company;
}

export async function deleteCompany({ activeCompanyId, userId }: SessionPayload) {
  await requireOwner(activeCompanyId!, userId);

  const company = await prisma.company.delete({
    where: {
      id: activeCompanyId,
    },
  });
  if (!company) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'A empresa não existe ou foi removida');
  }

  return company;
}
