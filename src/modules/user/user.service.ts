import prisma from '@/lib/prisma';
import { findUserByEmail } from './user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    throw new Error('User already exists');
  }

  const hash = await bcrypt.hash(password, 236);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
    },
  });

  if (!user) {
    throw new Error('Error creating user');
  }

  const jwtKey = process.env.JWT_KEY;

  const token = jwt.sign({}, jwtKey, {
    subject: user.id,
    expiresIn: '1d',
  });

  return token;
}

export async function loginUser({ email, password }: LoginUserParams) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('User does not exists');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const jwtKey = process.env.JWT_KEY;

  const token = jwt.sign({}, jwtKey, {
    subject: user.id,
    expiresIn: '1d',
  });

  return token;
}
