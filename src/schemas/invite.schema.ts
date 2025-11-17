import { UserSchema } from '@/schemas/user.schema';
import { CompanySchema } from '@/schemas/company.schema';
import { z } from '@/lib/zod';
import { Role } from '@/generated/prisma/enums';

export const InviteSchema = z.object({
  id: z.string(),
  email: z.email(),
  companyId: z.string(),
  token: z.string(),
  role: z.enum(Role),
  expiresAt: z.date(),
  accepted: z.boolean(),
  company: z.object(CompanySchema),
  user: z.object(UserSchema),
});

export const InviteMemberResponse = z.object({
  invite: z.object(InviteSchema),
  previewUrl: z.url(),
});

export const CreateInviteBodySchema = z.object({
  email: z.email('Email inválido'),
  role: z.enum(Role, 'Cargo inválido'),
});
