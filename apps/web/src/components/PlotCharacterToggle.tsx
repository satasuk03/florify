'use client';

export type ViewMode = 'plot' | 'character';

/**
 * Segmented pill that toggles between the plot canvas (🌱) and the
 * character scene (👤). Menu chrome stays in place — only the center
 * canvas swaps. Visual style mirrors the Settings TH/EN language toggle.
 */
export function PlotCharacterToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  return (
    <div
      className="flex rounded-full bg-cream-200/80 backdrop-blur-md border border-cream-300/60 p-0.5 shadow-soft-sm pointer-events-auto"
      role="tablist"
    >
      <Segment active={mode === 'plot'} emoji="🌱" label="Plot" onClick={() => onChange('plot')} />
      <Segment active={mode === 'character'} emoji="👤" label="Character" onClick={() => onChange('character')} />
    </div>
  );
}

function Segment({
  active,
  emoji,
  label,
  onClick,
}: {
  active: boolean;
  emoji: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-selected={active}
      role="tab"
      className={`px-3 py-1 rounded-full text-xs leading-none transition-all duration-200 ${
        active ? 'bg-cream-50 shadow-sm' : 'opacity-55 hover:opacity-90'
      }`}
    >
      <span aria-hidden>{emoji}</span>
    </button>
  );
}
