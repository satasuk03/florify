import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'bg-cream-100 border border-cream-300 rounded-xl shadow-soft-sm',
        'transition-all duration-300 ease-out',
        className,
      )}
      {...rest}
    />
  );
}
