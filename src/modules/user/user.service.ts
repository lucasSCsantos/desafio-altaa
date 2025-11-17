import prisma from '@/lib/prisma';
import { findUserByEmail, findUserById, findUserByIdAndCompany } from './user.repository';
import bcrypt from 'bcryptjs';
import { SessionPayload, signJWT } from '@/lib/auth';
import { ApiError } from '@/lib/api-error';

interface CreateUserParams {
  email: string;
  name: string;
  password: string;
}

interface LoginUserParams {
  email: string;
  password: string;
}

export async function createUser({ email, name, password }: CreateUserParams) {
  const userExists = await findUserByEmail(email);

  if (userExists) {
    throw new ApiError(400, 'USER_ALREADY_EXISTS', 'Já existe um usuário com esse e-mail');
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
    },
  });

  if (!user) {
    throw new ApiError(409, 'USER_CREATION_FAILED', 'Não foi possível criar o usuário');
  }

  const token = signJWT({
    userId: user.id,
  });

  return token;
}

export async function loginUser({ email, password }: LoginUserParams) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'Usuário não encontrado');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, 'INVALID_PASSWORD', 'Senha inválida');
  }
  const token = signJWT({
    userId: user.id,
  });

  return token;
}

export async function getUser({ userId, activeCompanyId }: SessionPayload) {
  let user;

  if (activeCompanyId) {
    user = await findUserByIdAndCompany(userId, activeCompanyId);

    user = {
      ...user,
      role: user?.memberships[0]?.role,
    };
  } else {
    user = await findUserById(userId);
  }

  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'Usuário não encontrado');
  }

  return user;
}
