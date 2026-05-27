import { describe, it, expect } from 'vitest';
import { validateMessages } from '@/scripts/validate-messages';

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['hero'],
  properties: {
    hero: {
      type: 'object',
      additionalProperties: false,
      required: ['headline'],
      properties: { headline: { type: 'string' } },
    },
  },
} as const;

const valid = { hero: { headline: 'X' } };
const missingKey = { hero: {} };
const extraKey = { hero: { headline: 'X', stray: 'oops' } };
const wrongType = { hero: { headline: 42 } };

describe('validateMessages', () => {
  it('passes for valid + matching locales', () => {
    const result = validateMessages(schema as any, { de: valid, en: valid });
    expect(result.ok).toBe(true);
  });

  it('fails when a required key is missing', () => {
    const result = validateMessages(schema as any, { de: valid, en: missingKey });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(' ')).toMatch(/headline/);
  });

  it('fails when a stray key is present', () => {
    const result = validateMessages(schema as any, { de: valid, en: extraKey });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(' ')).toMatch(/stray/);
  });

  it('fails when a value has wrong type', () => {
    const result = validateMessages(schema as any, { de: valid, en: wrongType });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(' ')).toMatch(/string/);
  });
});
