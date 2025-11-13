import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2),
  logo: z.string(),
});

export const selectCompanySchema = z.object({
  companyId: z.uuid(),
});
