import { describe, it, expect } from 'vitest';
import { color, fontSize, radius, shadow } from './index';

describe('design tokens', () => {
  it('exposes brand colors', () => {
    expect(color.bg.primary).toBe('#0A1A2F');
    expect(color.accent.cyan).toBe('#00E0FF');
    expect(color.text.secondary).toBe('#446C8F');
  });
  it('exposes type scale', () => {
    expect(fontSize.body).toBe('16px');
  });
  it('exposes radius and shadows', () => {
    expect(radius.button).toBe(20);
    expect(shadow.ctaGlow).toContain('rgba(0,224,255');
  });
});
