import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';

// TODO: replace with real store URLs once the apps are listed.
const APP_STORE_URL = '#';
const PLAY_STORE_URL = '#';

export function AppDownload() {
  const t = useTranslations('appDownload');
  return (
    <section id="download" className="relative py-14 md:py-20 border-t border-border-default overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,224,255,0.08),transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[960px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-4">{t('eyebrow')}</div>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-4 text-body-lg text-steel max-w-[560px] mx-auto">{t('body')}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={APP_STORE_URL}
              className="inline-flex items-center gap-3 min-h-[56px] px-6 rounded-button bg-navy border border-border-default hover:border-cyan transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2"
              aria-label={t('iosAria')}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                <path d="M17.564 13.265c-.02-2.07 1.69-3.06 1.766-3.108-.962-1.406-2.46-1.6-2.99-1.62-1.276-.128-2.49.752-3.139.752-.65 0-1.65-.732-2.717-.71-1.397.02-2.687.811-3.408 2.06-1.45 2.514-.37 6.235 1.045 8.276.69 1 1.514 2.118 2.59 2.077 1.04-.04 1.436-.673 2.694-.673 1.257 0 1.612.673 2.71.65 1.118-.02 1.828-1.018 2.512-2.02.79-1.155 1.116-2.279 1.135-2.337-.025-.012-2.178-.834-2.198-3.347zm-2.072-6.144c.574-.696.96-1.661.854-2.622-.825.034-1.825.547-2.418 1.241-.532.617-.997 1.6-.872 2.544.921.071 1.862-.467 2.436-1.163z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-steel uppercase tracking-wider">{t('iosSmall')}</div>
                <div className="text-white text-body font-semibold leading-tight">{t('iosLarge')}</div>
              </div>
            </a>
            <a
              href={PLAY_STORE_URL}
              className="inline-flex items-center gap-3 min-h-[56px] px-6 rounded-button bg-navy border border-border-default hover:border-cyan transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2"
              aria-label={t('androidAria')}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 2.5v19c0 .4.2.8.5 1L14 13 4 1.5c-.3.3-.5.6-.5 1z" fill="#00E0FF"/>
                <path d="M4 22.5L14 13l3 3-9.5 5.5c-.5.3-1 .3-1.5 0-.5-.2-1-.6-2-.5z" fill="#FFFFFF" opacity="0.7"/>
                <path d="M17 16l-3-3 3-3 3.5 2c.5.3.5 1 0 1.3L17 16z" fill="#446C8F"/>
                <path d="M4 1.5L14 13 4 22.5c-.3-.2-.5-.6-.5-1v-19c0-.4.2-.8.5-1z" fill="#00E0FF" opacity="0.6"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-steel uppercase tracking-wider">{t('androidSmall')}</div>
                <div className="text-white text-body font-semibold leading-tight">{t('androidLarge')}</div>
              </div>
            </a>
          </div>
          <p className="mt-6 text-caption text-steel">{t('availability')}</p>
        </Reveal>
      </div>
    </section>
  );
}
