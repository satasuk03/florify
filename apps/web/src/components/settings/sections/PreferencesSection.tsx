'use client';

import type { Language } from '@florify/shared';
import { Card } from '@/components/Card';
import { loadSettings, saveSettings } from '@/store/settingsStore';
import { useT, useLanguage } from '@/i18n/useT';

export function PreferencesSection() {
  const t = useT();
  const language = useLanguage();

  const setLanguage = (lang: Language) => {
    saveSettings({ ...loadSettings(), language: lang });
  };

  return (
    <section>
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
        {t('settings.preferences')}
      </h2>
      <div className="space-y-3">
        <Card className="p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-base text-ink-900">{t('settings.language')}</div>
            <div className="text-xs text-ink-500 mt-0.5">{t('settings.languageHint')}</div>
          </div>
          <div className="flex rounded-full bg-cream-200 p-0.5">
            {(['th', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase transition-all duration-200 ${
                  language === lang
                    ? 'bg-cream-50 text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {lang === 'th' ? 'TH' : 'EN'}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
