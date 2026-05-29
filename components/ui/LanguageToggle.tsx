'use client';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

const LOCALES = ['de', 'en'] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');

  const switchTo = (next: string) => {
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    router.replace(segments.join('/'));
  };

  return (
    <div role="group" aria-label={t('switchLang')} className="inline-flex items-center gap-1 rounded-pill border border-border-default p-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          className={clsx(
            'min-h-[36px] min-w-[44px] px-3 rounded-pill text-caption font-medium transition-colors',
            locale === l ? 'bg-cyan text-navy' : 'text-steel hover:text-white',
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
