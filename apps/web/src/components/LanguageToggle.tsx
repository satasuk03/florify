'use client';

import { loadSettings, saveSettings } from '@/store/settingsStore';
import { CornerButton } from '@/components/CornerButton';
import { useLanguage, useT } from '@/i18n/useT';

/**
 * Round corner button that toggles between TH and EN. Shows the current
 * language code as its label — tap to cycle. Reuses `CornerButton` so it
 * inherits the exact size, surface, shadow, and hover/press behavior of
 * the Gallery / Florist / Settings chrome sitting around it.
 */
export function LanguageToggle() {
  const language = useLanguage();
  const t = useT();

  const toggle = () => {
    const next = language === 'th' ? 'en' : 'th';
    saveSettings({ ...loadSettings(), language: next });
  };

  return (
    <CornerButton onClick={toggle} label={t('plot.switchLanguage')} size="primary">
      <span className="flex items-center justify-center text-[11px] font-semibold uppercase translate-y-[0.5px]">
        {language.toUpperCase()}
      </span>
    </CornerButton>
  );
}
