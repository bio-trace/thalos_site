'use client';
import { useTranslations } from 'next-intl';
import { PhoneScreenshot } from '@/components/ui/PhoneScreenshot';

const SLIDES = ['home', 'sleep', 'meals'] as const;

export function ProductInMotion() {
  const t = useTranslations('productInMotion');
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white text-center">{t('title')}</h2>
        <div className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
          <div className="hidden lg:block sticky top-24 self-start">
            <PhoneScreenshot alt="Thalos app screen" />
          </div>
          <div className="space-y-24">
            {SLIDES.map((s) => (
              <div key={s} className="grid grid-cols-1 gap-6">
                <div className="lg:hidden flex justify-center">
                  <PhoneScreenshot alt={`Thalos app ${s} screen`} />
                </div>
                <div>
                  <h3 className="text-h2 font-semibold text-white">{t(`slides.${s}.title`)}</h3>
                  <p className="mt-3 text-body-lg text-steel">{t(`slides.${s}.body`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
