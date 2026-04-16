'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CosmeticType } from '@florify/shared';
import { CosmeticBoxPacket } from './CosmeticBoxPacket';
import { CHARACTERS_BY_ID, characterImagePath } from '@/data/characters';
import { BACKGROUNDS_BY_ID, backgroundImagePath } from '@/data/backgrounds';
import { useT, useLanguage } from '@/i18n/useT';
import { CoinIcon } from '@/components/icons';
import type { CosmeticBoxResult } from '@/store/gameStore';

interface Props {
  type: CosmeticType;
  result: CosmeticBoxResult;
  onDismiss: () => void;
}

/**
 * Two-phase reveal: packet shake/tear → outcome card. Outcome is one of:
 *   - cosmetic item (character or background) → show image + name + rarity
 *   - gold consolation → show coin + amount
 *   - water drops consolation → show drop + amount
 */
export function CosmeticBoxOverlay({ type, result, onDismiss }: Props) {
  const t = useT();
  const lang = useLanguage();
  const [phase, setPhase] = useState<'opening' | 'revealed'>('opening');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm animate-fade-up"
      onClick={phase === 'revealed' ? onDismiss : undefined}
    >
      {phase === 'opening' && (
        <div className="w-52 h-80">
          <CosmeticBoxPacket
            type={type}
            state="opening"
            onComplete={() => setPhase('revealed')}
          />
        </div>
      )}

      {phase === 'revealed' && (
        <div
          className="max-w-xs w-full mx-4 rounded-3xl bg-cream-50 border border-cream-200 shadow-soft-lg p-6 text-center animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          <OutcomeBody type={type} result={result} lang={lang} />
          <button
            type="button"
            onClick={onDismiss}
            className="mt-4 w-full rounded-full bg-ink-900 text-cream-50 font-semibold py-2.5 text-sm transition-opacity hover:opacity-90 active:opacity-80"
          >
            {t('cosmetics.continue')}
          </button>
        </div>
      )}
    </div>
  );
}

function OutcomeBody({
  type,
  result,
  lang,
}: {
  type: CosmeticType;
  result: CosmeticBoxResult;
  lang: 'th' | 'en';
}) {
  const t = useT();
  if (result.item) {
    const { id, rarity, isNew } = result.item;
    const def = type === 'character' ? CHARACTERS_BY_ID[id] : BACKGROUNDS_BY_ID[id];
    if (!def) return null;
    const img = type === 'character'
      ? characterImagePath(def)
      : backgroundImagePath(def);
    const name = lang === 'th' ? def.nameTH : def.nameEN;
    return (
      <>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-500 mb-1">
          {t(`cosmetics.rarity.${rarity}`)}
          {isNew && <span className="ml-2 text-leaf-600">{t('cosmetics.new')}</span>}
        </div>
        <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 mb-3">
          <Image src={img} alt={name} fill className="object-cover" unoptimized />
        </div>
        <h3 className="font-serif text-lg font-bold text-ink-900">{name}</h3>
      </>
    );
  }
  if (result.goldAmount != null) {
    return (
      <>
        <div className="mb-3 flex justify-center"><CoinIcon size={48} /></div>
        <div className="font-serif text-2xl font-bold text-amber-600 tabular-nums">
          +{result.goldAmount}
        </div>
        <div className="text-xs text-ink-500 mt-1">{t('cosmetics.goldConsolation')}</div>
      </>
    );
  }
  if (result.dropsAmount != null) {
    return (
      <>
        <div className="text-5xl mb-3">💧</div>
        <div className="font-serif text-2xl font-bold text-sky-600 tabular-nums">
          +{result.dropsAmount}
        </div>
        <div className="text-xs text-ink-500 mt-1">{t('cosmetics.dropsConsolation')}</div>
      </>
    );
  }
  return null;
}
