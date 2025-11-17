import { z } from '@/lib/zod';
import { MemberSchema } from '@/schemas/membership.schema';

export const CompanySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  logo: z.string(),
  memberships: z.array(MemberSchema),
});

export const CreateCompanyBodySchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  logo: z.string().min(1, 'O logo é obrigatório').max(2, 'O logo deve ter no máximo 1 caractere'),
});
