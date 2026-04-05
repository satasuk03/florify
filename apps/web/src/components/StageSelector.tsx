'use client';

/**
 * 1/2/3 growth-stage tabs. Previously inlined in DetailView; extracted
 * so FloripediaView can reuse the same control without copy-pasting.
 * Pure presentational component — no store, no i18n coupling (label
 * text is provided by the caller so each surface can localize in its
 * own style).
 */

export type Stage = 1 | 2 | 3;
export const STAGES: readonly Stage[] = [1, 2, 3];
export const STAGE_PROGRESS: Record<Stage, number> = { 1: 0, 2: 0.5, 3: 1 };

interface Props {
  stage: Stage;
  onChange: (s: Stage) => void;
  label: (s: Stage) => string;
}

export function StageSelector({ stage, onChange, label }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Growth stage"
      className="relative inline-flex items-center gap-1 p-1 rounded-full bg-cream-100/95 backdrop-blur border border-cream-300/70 shadow-soft-sm"
    >
      {STAGES.map((s) => {
        const active = s === stage;
        return (
          <button
            key={s}
            role="tab"
            aria-selected={active}
            aria-label={label(s)}
            onClick={() => onChange(s)}
            className={`relative w-8 h-8 rounded-full text-xs font-medium tabular-nums transition-all duration-300 ease-out ${
              active
                ? 'bg-ink-900 text-cream-50 shadow-soft-sm scale-105'
                : 'text-ink-500 hover:text-ink-900 hover:bg-cream-200/70'
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
