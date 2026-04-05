'use client';

/**
 * Accessible on/off switch. Extracted so both `SettingsView` (route)
 * and `SettingsSheet` (home modal) can share a single implementation.
 */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors duration-300 ease-out flex-shrink-0 ${
        checked ? 'bg-clay-500' : 'bg-cream-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-cream-50 shadow-soft-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
