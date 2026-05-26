import * as React from 'react';
import clsx from 'clsx';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, Props>(function FormTextarea(
  { label, error, id, className, ...rest },
  ref,
) {
  const ta = id ?? rest.name;
  return (
    <label className="block">
      <span className="block text-caption text-steel mb-2">{label}</span>
      <textarea
        ref={ref}
        id={ta}
        aria-invalid={!!error}
        rows={4}
        className={clsx(
          'w-full rounded-card-sm bg-navy border border-border-default p-4 text-white placeholder:text-steel focus:border-cyan outline-none transition-colors',
          className,
        )}
        {...rest}
      />
      {error && <span className="block mt-1 text-caption text-white">{error}</span>}
    </label>
  );
});
