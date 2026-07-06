'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { FormSelect } from '@/components/ui/FormSelect';
import { contactSchema, INQUIRY_TYPES, type InquiryType } from '@/lib/validation';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

// Map URL hash → preselected inquiry type
const HASH_TO_TYPE: Record<string, InquiryType> = {
  'contact-first-customer': 'first_customer',
  'contact-partner-gym': 'partner_gym',
  'contact-founding-athlete': 'founding_athlete',
  'contact-press': 'press',
  'contact-general': 'general',
  'contact-other': 'other',
};

export function Contact() {
  const t = useTranslations('contact');
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inquiryType, setInquiryType] = useState<InquiryType>('partner_gym');

  // Preselect type from URL hash on mount + on hashchange.
  // The CTA hashes (#contact-partner-gym etc.) don't match a real element id,
  // so scroll the section into view manually when one is detected.
  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace('#', '');
      const mapped = HASH_TO_TYPE[raw];
      if (mapped) {
        setInquiryType(mapped);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const showGymFields = inquiryType === 'partner_gym';
  const isFirstCustomer = inquiryType === 'first_customer';

  const typeOptions = INQUIRY_TYPES.map((v) => ({
    value: v,
    label: t(`form.types.${v}`),
  }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());

    const data: Record<string, unknown> = {
      inquiryType: raw.inquiryType,
      name: raw.name,
      email: raw.email,
    };
    if (raw.inquiryType === 'first_customer') {
      data.country = raw.country;
      data.phone = raw.phone;
    } else {
      data.message = raw.message;
    }
    if (raw.inquiryType === 'partner_gym') {
      data.gym = raw.gym;
      data.city = raw.city;
    }

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const key = i.path[0] as string;
        if (!errs[key]) errs[key] = i.message;
      }
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
    <section id="contact" className="relative py-14 md:py-20 overflow-hidden">
      {/* Scroll anchors for CTA deep-links (e.g. #contact-partner-gym).
          Offset above the section so the fixed nav doesn't overlap the heading. */}
      {Object.keys(HASH_TO_TYPE).map((id) => (
        <span key={id} id={id} aria-hidden="true" className="pointer-events-none absolute -top-20 left-0" />
      ))}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,224,255,0.12),transparent_60%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-[960px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-3">{t('eyebrow')}</div>
        <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
        <p className="mt-4 text-body-lg text-steel max-w-[640px]">{t('body')}</p>

        <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4" noValidate aria-live="polite">
          <div className="md:col-span-2">
            <FormSelect
              name="inquiryType"
              label={t('form.inquiryType')}
              options={typeOptions}
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value as InquiryType)}
              error={errors.inquiryType}
            />
          </div>

          <FormInput name="name" label={t('form.name')} required error={errors.name} />
          <FormInput name="email" type="email" label={t('form.email')} required error={errors.email} />

          {showGymFields && (
            <>
              <FormInput name="gym" label={t('form.gym')} required error={errors.gym} />
              <FormInput name="city" label={t('form.city')} required error={errors.city} />
            </>
          )}

          {isFirstCustomer && (
            <>
              <FormInput name="country" label={t('form.country')} required error={errors.country} />
              <FormInput name="phone" type="tel" label={t('form.phone')} required error={errors.phone} />
            </>
          )}

          {!isFirstCustomer && (
            <div className="md:col-span-2">
              <FormTextarea name="message" label={t('form.message')} required error={errors.message} />
            </div>
          )}

          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button size="lg" disabled={state === 'submitting'}>
              {t('form.submit')}
            </Button>
            {state === 'success' && <span role="status" className="text-cyan text-caption">{t('form.success')}</span>}
            {state === 'error' && <span role="status" className="text-white text-caption">{t('form.error')}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
