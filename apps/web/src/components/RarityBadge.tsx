import type { Rarity } from '@florify/shared';

const label: Record<Rarity, string> = {
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
};

const cls: Record<Rarity, string> = {
  common: 'bg-cream-200 text-ink-700',
  rare: 'bg-[#E5EDF3] text-[#3E5A73]',
  legendary: 'bg-[#F7EBCF] text-[#8A5E1C]',
};

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls[rarity]}`}
    >
      {label[rarity]}
    </span>
  );
}
