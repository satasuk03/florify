'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { DISPLAY_NAME_MAX_LENGTH } from '@/store/gameStore';
import { useT } from '@/i18n/useT';
import type { DictKey } from '@/i18n/dict';
import { SPECIES } from '@/data/species';

interface Props {
  onComplete: () => void;
  onNameChange: (name: string) => void;
  initialName: string;
}

/** Picks a species folder to show on each tutorial step. */
const STEP_FLORA = [
  { folder: 'sunleaf', stage: 1 },   // Plant → seedling
  { folder: 'sunfern', stage: 2 },   // Water → young
  { folder: 'sunbloom', stage: 3 },  // Harvest → mature
] as const;

export function WelcomeDialogue({ onComplete, onNameChange, initialName }: Props) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);

  const handleNext = () => {
    if (step === 0) {
      onNameChange(name.trim() || 'Guest');
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (step === 0) onNameChange(name.trim() || 'Guest');
    onComplete();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50/90 backdrop-blur-sm animate-overlay-in"
    >
      <div
        className="relative flex flex-col items-center gap-5 px-8 text-center max-w-sm animate-scale-in"
        style={{ animationDelay: '80ms' }}
      >
        {/* Step 0: Welcome + Name */}
        {step === 0 && (
          <>
            <h1
              className="font-serif text-4xl font-bold text-ink-900 tracking-[0.15em] animate-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              Florify
            </h1>
            <p
              className="text-sm text-ink-600 -mt-2 animate-fade-up"
              style={{ animationDelay: '180ms' }}
            >
              {t('welcome.subtitle')}
            </p>

            {/* Flora showcase — show 3 stages side by side */}
            <div
              className="flex items-end justify-center gap-3 py-2 animate-fade-up"
              style={{ animationDelay: '240ms' }}
            >
              {STEP_FLORA.map(({ folder, stage }, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={folder}
                  src={`/floras/${folder}/stage-${stage}.webp`}
                  alt=""
                  draggable={false}
                  className="object-contain"
                  style={{
                    height: `${56 + i * 20}px`,
                    opacity: 0.6 + i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Name input */}
            <div
              className="w-full max-w-[260px] animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              <label htmlFor="welcome-name" className="block text-sm text-ink-700 mb-2">
                {t('welcome.nameLabel')}
              </label>
              <input
                id="welcome-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={DISPLAY_NAME_MAX_LENGTH}
                placeholder={t('welcome.namePlaceholder')}
                autoFocus
                className="w-full px-3 py-2.5 rounded-xl bg-cream-100 border border-cream-300 text-ink-900 text-center placeholder:text-ink-400 focus:outline-none focus:border-clay-500 transition-colors"
              />
            </div>

          </>
        )}

        {/* Step 1: Plant & Water */}
        {step === 1 && (
          <>
            <h2
              key="title-1"
              className="font-serif text-2xl text-ink-900 animate-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              {t('welcome.step1.title')} & {t('welcome.step2.title')}
            </h2>
            <div className="flex flex-col gap-4 w-full max-w-[280px]">
              {([
                { titleKey: 'welcome.step1.title' as DictKey, bodyKey: 'welcome.step1.body' as DictKey, flora: STEP_FLORA[0] },
                { titleKey: 'welcome.step2.title' as DictKey, bodyKey: 'welcome.step2.body' as DictKey, flora: STEP_FLORA[1] },
              ]).map(({ titleKey, bodyKey, flora }, i) => (
                <div
                  key={titleKey}
                  className="flex items-center gap-4 text-left animate-fade-up"
                  style={{ animationDelay: `${200 + i * 80}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/floras/${flora.folder}/stage-${flora.stage}.webp`}
                    alt=""
                    draggable={false}
                    className="w-16 h-16 object-contain shrink-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-ink-900">{t(titleKey)}</div>
                    <div className="text-xs text-ink-600 leading-relaxed mt-0.5">{t(bodyKey)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Harvest */}
        {step === 2 && (
          <>
            <h2
              key="title-2"
              className="font-serif text-2xl text-ink-900 animate-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              {t('welcome.step3.title')}
            </h2>
            <div className="flex flex-col gap-4 w-full max-w-[280px]">
              <div
                className="flex items-center gap-4 text-left animate-fade-up"
                style={{ animationDelay: '200ms' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/floras/${STEP_FLORA[2].folder}/stage-${STEP_FLORA[2].stage}.webp`}
                  alt=""
                  draggable={false}
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div>
                  <div className="text-sm font-medium text-ink-900">{t('welcome.step3.title')}</div>
                  <div className="text-xs text-ink-600 leading-relaxed mt-0.5">{t('welcome.step3.body')}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Browser-save notice */}
        {step === 3 && (
          <>
            <div
              className="text-5xl animate-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              ⚠️💾
            </div>
            <h2
              key="title-3"
              className="font-serif text-2xl text-ink-900 animate-fade-up"
              style={{ animationDelay: '180ms' }}
            >
              {t('welcome.browserSave.title')}
            </h2>
            <p
              className="text-sm text-ink-600 max-w-[280px] leading-relaxed animate-fade-up"
              style={{ animationDelay: '240ms' }}
            >
              {t('welcome.browserSave.body')}
            </p>
          </>
        )}

        {/* Step indicators */}
        <div className="flex gap-2 animate-fade-up" style={{ animationDelay: '420ms' }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'bg-clay-500 scale-125'
                  : i < step
                    ? 'bg-clay-300'
                    : 'bg-cream-300'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div
          className="flex flex-col items-center gap-2 w-full animate-fade-up"
          style={{ animationDelay: '480ms' }}
        >
          <Button size="lg" onClick={handleNext} className="w-full max-w-[260px]">
            {step < 3 ? t('welcome.next') : t('welcome.start')}
          </Button>
          <button
            onClick={handleSkip}
            className="text-sm text-ink-500 hover:text-ink-700 transition-colors py-1"
          >
            {t('welcome.skip')}
          </button>
        </div>

        {/* Rarity teaser on last step */}
        {step === 3 && (
          <p
            className="text-xs text-ink-500 animate-fade-up"
            style={{ animationDelay: '540ms' }}
          >
            {t('welcome.rarity', { total: SPECIES.length })}
          </p>
        )}
      </div>
    </div>
  );
}
