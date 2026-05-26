import { describe, it, expect } from 'vitest';
import { partnerGymSchema } from './validation';

describe('partnerGymSchema', () => {
  it('passes valid input', () => {
    const r = partnerGymSchema.safeParse({
      name: 'Max', gym: 'DASGYM', city: 'Vienna', email: 'max@example.com', message: '',
    });
    expect(r.success).toBe(true);
  });
  it('rejects invalid email', () => {
    const r = partnerGymSchema.safeParse({
      name: 'Max', gym: 'DASGYM', city: 'Vienna', email: 'nope', message: '',
    });
    expect(r.success).toBe(false);
  });
  it('rejects missing required', () => {
    const r = partnerGymSchema.safeParse({ name: '', gym: '', city: '', email: '', message: '' });
    expect(r.success).toBe(false);
  });
});
