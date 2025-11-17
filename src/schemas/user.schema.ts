import { z } from '@/lib/zod';

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});

export const CreateUserBodySchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(30, 'O nome deve ter no máximo 254 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  // .max(20, 'A senha deve ter no máximo 20 caracteres'),
});

export const LoginUserBodySchema = z.object({
  email: z.email('Email inválido'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(20, 'A senha deve ter no máximo 20 caracteres'),
});
