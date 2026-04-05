import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-clay-500 text-cream-50 hover:bg-clay-400 active:bg-clay-600 shadow-soft-md hover:shadow-soft-lg shine-on-hover',
  secondary: 'bg-cream-100 text-ink-900 hover:bg-cream-200 border border-cream-300',
  ghost: 'bg-transparent text-ink-700 hover:bg-cream-100',
};

const sizeClasses: Record<Size, string> = {
  md: 'h-11 px-5 text-base rounded-lg',
  lg: 'h-14 px-8 text-lg rounded-xl min-w-[180px]',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={clsx(
        // Ease-out + longer duration reads as "settled" rather than snappy.
        // `active:scale` gives a subtle press affordance without looking toy-like.
        'font-medium transition-all duration-300 ease-out',
        'active:scale-[0.98] motion-reduce:active:scale-100',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
});
