/**
 * SVG icon set — stroke-based, consumes `currentColor` so parent Text
 * utilities drive the color (warm ink-700 by default).
 */

interface IconProps {
  size?: number;
  className?: string;
}

export function GalleryIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 16 L15 11 L5 20" />
    </svg>
  );
}

export function FloristCardIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="M12 6.5 A2.2 2.2 0 0 1 14.2 8.7" />
      <path d="M12 6.5 A2.2 2.2 0 0 0 9.8 8.7" />
      <path d="M15.5 10 A2.2 2.2 0 0 1 13.3 12.2" />
      <path d="M8.5 10 A2.2 2.2 0 0 0 10.7 12.2" />
      <path d="M8 16 H16" />
      <path d="M8 18.5 H13" />
    </svg>
  );
}

export function UserIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
    </svg>
  );
}

export function WaterDropIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3 C 12 3 5 11 5 15 A7 7 0 0 0 19 15 C 19 11 12 3 12 3 Z" />
    </svg>
  );
}

export function BackIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 18 L9 12 L15 6" />
    </svg>
  );
}
