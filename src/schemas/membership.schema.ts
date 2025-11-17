import { UserSchema } from '@/schemas/user.schema';
import { z } from '@/lib/zod';
import { Role } from '@/generated/prisma/enums';

export const UpdateRoleBodySchema = z.object({
  role: z.enum(Role),
  userId: z.string(),
});

export const DeleteMemberBodySchema = z.object({
  userId: z.uuid(),
});

export const MemberSchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  userId: z.uuid(),
  role: z.enum(Role),
  user: z.object(UserSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
