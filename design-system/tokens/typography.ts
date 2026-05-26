export const fontSize = {
  display: 'clamp(48px, 6vw, 88px)',
  h1: 'clamp(36px, 4vw, 56px)',
  h2: 'clamp(24px, 2.5vw, 32px)',
  bodyLg: '20px',
  body: '16px',
  caption: '13px',
  eyebrow: '12px',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const tracking = {
  tight: '-0.02em',
  normal: '0',
  eyebrow: '0.12em',
} as const;

export const leading = {
  tight: 1.1,
  body: 1.65,
} as const;
