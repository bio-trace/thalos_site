import { z } from 'zod';

export const INQUIRY_TYPES = ['first_customer', 'partner_gym', 'general', 'founding_athlete', 'press', 'other'] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

const baseFields = {
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(5).max(2000),
};

export const contactSchema = z.discriminatedUnion('inquiryType', [
  // Founding Athlete beta is full — early registration for first customers.
  // Only contact details; no free-text message.
  z.object({
    inquiryType: z.literal('first_customer'),
    name: z.string().min(2).max(120),
    email: z.string().email(),
    country: z.string().min(2).max(120),
    phone: z.string().min(4).max(40),
  }),
  z.object({
    inquiryType: z.literal('partner_gym'),
    gym: z.string().min(2).max(160),
    city: z.string().min(2).max(120),
    ...baseFields,
  }),
  z.object({
    inquiryType: z.literal('general'),
    ...baseFields,
  }),
  z.object({
    inquiryType: z.literal('founding_athlete'),
    ...baseFields,
  }),
  z.object({
    inquiryType: z.literal('press'),
    ...baseFields,
  }),
  z.object({
    inquiryType: z.literal('other'),
    ...baseFields,
  }),
]);

export type ContactInput = z.infer<typeof contactSchema>;

// Backward-compat alias for tests + older callers
export const partnerGymSchema = contactSchema;
