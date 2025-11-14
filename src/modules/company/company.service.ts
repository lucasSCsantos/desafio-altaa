import prisma from '@/lib/prisma';
import { findCompaniesByUserId, findCompanyById } from './company.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setUserActiveCompany } from '../user/user.repository';
import { SessionPayload, signJWT } from '@/lib/auth';

interface CreateCompanyParams {
  name: string;
  logo: string;
}

interface ListCompaniesParams {
  userId: string;
}

interface SelectCompanyParams {
  companyId: string;
}

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
    throw new Error('Error creating user');
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

  return companies;
}

export async function selectCompany({ userId }: SessionPayload, companyId: string) {
  const company = await findCompanyById(companyId);

  if (!company) {
    throw new Error('Company not found');
  }

  const user = await setUserActiveCompany(userId, companyId);

  if (!user) {
    throw new Error('Error selecting company');
  }

  const token = signJWT({
    userId,
    companyId: company.id,
  });

  return token;
}

export async function getCompany({ companyId }: SessionPayload) {
  const company = await findCompanyById(companyId!);

  if (!company) {
    throw new Error('Company not found');
  }

  return company;
}
