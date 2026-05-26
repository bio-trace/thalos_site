import * as React from 'react';
import clsx from 'clsx';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const FormInput = React.forwardRef<HTMLInputElement, Props>(function FormInput(
  { label, error, id, className, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  const errId = error ? `${inputId}-err` : undefined;
  return (
    <label className="block">
      <span className="block text-caption text-steel mb-2">{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={errId}
        className={clsx(
          'w-full min-h-[48px] rounded-card-sm bg-navy border border-border-default px-4 text-white placeholder:text-steel focus:border-cyan outline-none transition-colors',
          error && 'border-[#FFFFFF]',
          className,
        )}
        {...rest}
      />
      {error && <span id={errId} className="block mt-1 text-caption text-white">{error}</span>}
    </label>
  );
});
