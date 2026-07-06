import { describe, it, expect } from 'vitest';
import { contactSchema } from './validation';

describe('contactSchema', () => {
  describe('partner_gym', () => {
    it('passes with all required fields', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'partner_gym',
        name: 'Max',
        gym: 'DASGYM',
        city: 'Vienna',
        email: 'max@example.com',
        message: 'Would love to partner.',
      });
      expect(r.success).toBe(true);
    });

    it('rejects missing gym', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'partner_gym',
        name: 'Max',
        city: 'Vienna',
        email: 'max@example.com',
        message: 'hi there',
      });
      expect(r.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'partner_gym',
        name: 'Max',
        gym: 'DASGYM',
        city: 'Vienna',
        email: 'nope',
        message: 'hi there',
      });
      expect(r.success).toBe(false);
    });
  });

  describe('general', () => {
    it('passes without gym/city', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'general',
        name: 'Max',
        email: 'max@example.com',
        message: 'Question about the app.',
      });
      expect(r.success).toBe(true);
    });

    it('rejects short message', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'general',
        name: 'Max',
        email: 'max@example.com',
        message: 'hi',
      });
      expect(r.success).toBe(false);
    });
  });

  describe('founding_athlete + press', () => {
    it('founding_athlete passes', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'founding_athlete',
        name: 'Max',
        email: 'max@example.com',
        message: 'I train at DASGYM and want early access.',
      });
      expect(r.success).toBe(true);
    });

    it('press passes', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'press',
        name: 'Reporter',
        email: 'press@news.com',
        message: 'Article inquiry.',
      });
      expect(r.success).toBe(true);
    });
  });

  describe('first_customer', () => {
    it('passes with name/email/country/phone (no message)', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'first_customer',
        name: 'Max',
        email: 'max@example.com',
        country: 'Austria',
        phone: '+43 660 1234567',
      });
      expect(r.success).toBe(true);
    });

    it('rejects missing country', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'first_customer',
        name: 'Max',
        email: 'max@example.com',
        phone: '+43 660 1234567',
      });
      expect(r.success).toBe(false);
    });

    it('rejects missing phone', () => {
      const r = contactSchema.safeParse({
        inquiryType: 'first_customer',
        name: 'Max',
        email: 'max@example.com',
        country: 'Austria',
      });
      expect(r.success).toBe(false);
    });
  });

  it('rejects unknown inquiryType', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'invalid_type',
      name: 'Max',
      email: 'max@example.com',
      message: 'hi there',
    });
    expect(r.success).toBe(false);
  });
});
