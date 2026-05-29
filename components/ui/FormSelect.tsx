import * as React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

type Option = { value: string; label: string };

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label: string;
  options: Option[];
  error?: string;
};

export const FormSelect = React.forwardRef<HTMLSelectElement, Props>(function FormSelect(
  { label, options, error, id, className, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  const errId = error ? `${selectId}-err` : undefined;
  return (
    <label className="block">
      <span className="block text-caption text-steel mb-2">{label}</span>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={errId}
          className={clsx(
            'appearance-none w-full min-h-[48px] rounded-card-sm bg-navy border border-border-default px-4 pr-10 text-white focus:border-cyan outline-none transition-colors cursor-pointer',
            className,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-navy text-white">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan pointer-events-none"
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>
      {error && <span id={errId} className="block mt-1 text-caption text-white">{error}</span>}
    </label>
  );
});
