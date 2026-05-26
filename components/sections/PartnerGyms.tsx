'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { partnerGymSchema } from '@/lib/validation';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function PartnerGyms() {
  const t = useTranslations('partnerGyms');
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = partnerGymSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as string] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState('submitting');
    try {
      const res = await fetch('/api/partner-gym', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      setState(res.ok ? 'success' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <section id="partnerGyms" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,224,255,0.12),transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[960px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-3">{t('eyebrow')}</div>
        <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
        <p className="mt-4 text-body-lg text-steel max-w-[640px]">{t('body')}</p>

        <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4" noValidate aria-live="polite">
          <FormInput name="name" label={t('form.name')} required error={errors.name} />
          <FormInput name="gym" label={t('form.gym')} required error={errors.gym} />
          <FormInput name="city" label={t('form.city')} required error={errors.city} />
          <FormInput name="email" type="email" label={t('form.email')} required error={errors.email} />
          <div className="md:col-span-2">
            <FormTextarea name="message" label={t('form.message')} />
          </div>
          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button size="lg" disabled={state === 'submitting'}>{t('form.submit')}</Button>
            {state === 'success' && <span role="status" className="text-cyan text-caption">{t('form.success')}</span>}
            {state === 'error' && <span role="status" className="text-white text-caption">{t('form.error')}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
