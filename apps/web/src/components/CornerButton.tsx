'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

/**
 * Circular icon button used for the PlotView corner actions.
 *
 * Primary (44×44) is the default tap target per iOS HIG. Secondary
 * (36×36) is reserved for "Coming Soon" placeholder buttons like the
 * Login pin — slightly smaller + muted so it reads as secondary without
 * a separate color palette.
 *
 * The comingSoon variant gets a clay-500 dot + greyscale to telegraph
 * that the button isn't fully wired yet but is still tappable (fires a
 * toast explaining what's planned).
 */

interface Props {
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  size?: 'primary' | 'secondary';
  comingSoon?: boolean;
  children: ReactNode;
}

export function CornerButton({
  to,
  onClick,
  disabled,
  label,
  size = 'primary',
  comingSoon,
  children,
}: Props) {
  const cls = clsx(
    'relative pointer-events-auto rounded-full',
    'bg-cream-50/85 backdrop-blur-sm border border-cream-300',
    'flex items-center justify-center text-ink-700',
    'shadow-soft-sm transition-all duration-300 ease-out',
    'hover:bg-cream-100 hover:shadow-soft-md hover:-translate-y-0.5',
    'active:scale-95 active:translate-y-0 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100',
    size === 'primary' && 'h-11 w-11',
    size === 'secondary' && 'h-9 w-9 opacity-70',
    comingSoon && 'grayscale',
    disabled && 'opacity-40 pointer-events-none',
  );

  const dot = comingSoon ? (
    <span
      className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-clay-500 ring-2 ring-cream-50"
      aria-hidden
    />
  ) : null;

  const inner = (
    <>
      <span aria-hidden>{children}</span>
      {dot}
    </>
  );

  if (to) {
    return (
      <Link href={to} className={cls} aria-label={label}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls}
      disabled={disabled}
      aria-label={label}
    >
      {inner}
    </button>
  );
}
