'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import clsx from 'clsx';

const anchors = ['system', 'science', 'athletes', 'team', 'partnerGyms'] as const;

export function Nav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 inset-x-0 z-40 transition-all duration-200',
        scrolled ? 'bg-navy/80 backdrop-blur border-b border-border-default' : 'bg-transparent',
      )}
    >
      <nav className="max-w-[1280px] mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
        <Link href="#top" className="flex items-center gap-2" aria-label="Thalos">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4 L12 16 L20 4" stroke="#00E0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-semibold tracking-tight">Thalos</span>
        </Link>
        <ul className="hidden lg:flex items-center gap-8 text-steel text-body">
          {anchors.map((a) => (
            <li key={a}><a href={`#${a}`} className="hover:text-white transition-colors">{t(a)}</a></li>
          ))}
        </ul>
        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <Button href="#partnerGyms" size="md">{t('applyCta')}</Button>
        </div>
        <button
          className="lg:hidden p-2 text-white"
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden border-t border-border-default bg-navy px-4 py-6 space-y-4">
          {anchors.map((a) => (
            <a key={a} href={`#${a}`} onClick={() => setOpen(false)} className="block text-white text-body-lg">{t(a)}</a>
          ))}
          <LanguageToggle />
          <Button href="#partnerGyms" size="md" className="w-full">{t('applyCta')}</Button>
        </div>
      )}
    </header>
  );
}
