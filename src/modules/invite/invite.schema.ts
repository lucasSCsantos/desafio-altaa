import { z } from 'zod';

export const createInviteSchema = z.object({
  email: z.email(),
});

export const acceptInviteSchema = z.object({
  token: z.string(),
  userId: z.string(),
});
