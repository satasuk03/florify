'use client';

/**
 * TH/EN radio toggle used inside detail views. Local to the view — it
 * does NOT drive the app-wide language (that lives on Settings). Callers
 * own the state so each view can decide whether to default to app
 * language or always start in TH.
 *
 * Previously inlined in DetailView; extracted so FloripediaView can
 * reuse the same pill.
 */

export type Lang = 'th' | 'en';

interface Props {
  lang: Lang;
  onChange: (l: Lang) => void;
}

export function LangToggle({ lang, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Language"
      className="relative inline-flex items-center p-0.5 rounded-full bg-cream-200/80 text-xs font-medium"
    >
      <span
        aria-hidden
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-cream-50 shadow-soft-sm transition-transform duration-300 ease-out"
        style={{ transform: lang === 'th' ? 'translateX(0)' : 'translateX(100%)' }}
      />
      {(['th', 'en'] as const).map((code) => (
        <button
          key={code}
          role="tab"
          aria-selected={lang === code}
          onClick={() => onChange(code)}
          className={`relative z-10 px-3 py-1 rounded-full transition-colors duration-200 ${
            lang === code ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          {code === 'th' ? 'ไทย' : 'EN'}
        </button>
      ))}
    </div>
  );
}
