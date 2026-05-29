import type { Config } from 'tailwindcss';
import { color, fontSize, fontWeight, tracking, leading, radius, shadow } from './design-system/tokens';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: color.bg.primary,
        steel: color.text.secondary,
        cyan: color.accent.cyan,
        'border-default': color.border.default,
        'border-active': color.border.active,
      },
      backgroundImage: {
        'hero-gradient': color.gradient.hero,
      },
      fontSize: {
        display: fontSize.display,
        h1: fontSize.h1,
        h2: fontSize.h2,
        'body-lg': fontSize.bodyLg,
        body: fontSize.body,
        caption: fontSize.caption,
        eyebrow: fontSize.eyebrow,
      },
      fontWeight: {
        regular: fontWeight.regular.toString(),
        medium: fontWeight.medium.toString(),
        semibold: fontWeight.semibold.toString(),
        bold: fontWeight.bold.toString(),
      },
      letterSpacing: {
        tight: tracking.tight,
        eyebrow: tracking.eyebrow,
      },
      lineHeight: {
        tight: String(leading.tight),
        body: String(leading.body),
      },
      borderRadius: {
        card: `${radius.card}px`,
        'card-sm': `${radius.cardSm}px`,
        button: `${radius.button}px`,
        pill: '999px',
        phone: `${radius.phone}px`,
      },
      boxShadow: {
        'card-subtle': shadow.cardSubtle,
        'card-active': shadow.cardActive,
        'cta-glow': shadow.ctaGlow,
        'ring-glow': shadow.ringGlow,
      },
    },
  },
  plugins: [],
};

export default config;
