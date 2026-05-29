import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import Link from 'next/link';
import * as React from 'react';

const styles = cva(
  'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-150 ease-out min-h-[44px] px-6 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-cyan text-navy shadow-cta-glow hover:-translate-y-0.5 active:scale-[0.98]',
        secondary: 'border border-steel text-white hover:border-cyan active:scale-[0.98]',
        ghost: 'text-steel hover:text-white',
      },
      size: {
        md: 'text-[15px] h-12',
        lg: 'text-[17px] h-14 px-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type CommonProps = VariantProps<typeof styles> & { className?: string; children: React.ReactNode };
type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant, size, className, children } = props;
  const cls = clsx(styles({ variant, size }), className);
  if ('href' in props && props.href) {
    return <Link href={props.href} className={cls}>{children}</Link>;
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return <button className={cls} {...rest}>{children}</button>;
}
