import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageToggle } from './LanguageToggle';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/de',
}));
vi.mock('next-intl', () => ({
  useLocale: () => 'de',
  useTranslations: () => (k: string) => k,
}));

describe('LanguageToggle', () => {
  it('renders both locales', () => {
    render(<LanguageToggle />);
    expect(screen.getByRole('button', { name: /DE/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument();
  });
});
