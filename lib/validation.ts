import { z } from 'zod';

export const partnerGymSchema = z.object({
  name: z.string().min(2).max(120),
  gym: z.string().min(2).max(160),
  city: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().max(2000).optional().default(''),
});

export type PartnerGymInput = z.infer<typeof partnerGymSchema>;
