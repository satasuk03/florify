import type { CharacterDef } from './types';

// Provisional rarity tiers — adjust freely; the draw table keys off rarity only.
const series0: readonly CharacterDef[] = [
  { id: 0, slug: 'jianyu',    nameEN: 'Jianyu',    nameTH: 'เจี้ยนหยู',   rarity: 'common' },
  { id: 1, slug: 'kai',       nameEN: 'Kai',       nameTH: 'ไค',         rarity: 'common' },
  { id: 2, slug: 'mika',      nameEN: 'Mika',      nameTH: 'มิกะ',        rarity: 'common' },
  { id: 3, slug: 'noa',       nameEN: 'Noa',       nameTH: 'โนอา',       rarity: 'common' },
  { id: 4, slug: 'ren',       nameEN: 'Ren',       nameTH: 'เรน',         rarity: 'common' },
  { id: 5, slug: 'sebastian', nameEN: 'Sebastian', nameTH: 'เซบาสเตียน', rarity: 'common' },
  { id: 6, slug: 'anput',     nameEN: 'Anput',     nameTH: 'อันพุต',      rarity: 'rare' },
  { id: 7, slug: 'oharu',     nameEN: 'Oharu',     nameTH: 'โอฮารุ',      rarity: 'rare' },
  { id: 8, slug: 'ryuko',     nameEN: 'Ryuko',     nameTH: 'ริวโกะ',      rarity: 'legendary' },
];

export default series0;
