import { describe, it, expect, beforeEach } from 'vitest';
import {
  COSMETIC_BOX_DROPS,
  COSMETIC_BOX_TOTAL_WEIGHT,
  COSMETIC_BOX_COST,
  rollCosmeticBoxDrop,
} from '@florify/shared';
import { useGameStore } from '@/store/gameStore';
import { createInitialState } from '@/store/initialState';

function reset() {
  useGameStore.setState({ state: createInitialState(), hydrated: true });
}

describe('COSMETIC_BOX_DROPS table', () => {
  it('weights sum to 100 (= percent chances)', () => {
    expect(COSMETIC_BOX_TOTAL_WEIGHT).toBe(100);
  });

  it('contains one row per declared outcome', () => {
    expect(COSMETIC_BOX_DROPS).toHaveLength(8);
  });
});

describe('rollCosmeticBoxDrop', () => {
  it('returns proportional outcomes under uniform RNG', () => {
    const counts = new Map<string, number>();
    let seed = 1;
    const rng = () => {
      // Deterministic LCG so the test is reproducible.
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0x100000000;
    };

    const N = 20000;
    for (let i = 0; i < N; i++) {
      const d = rollCosmeticBoxDrop(rng);
      const key = d.kind === 'item' ? `item:${d.rarity}` : `${d.kind}:${d.amount}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    // Each outcome should land within ~20% of expected frequency over 20k rolls.
    for (const drop of COSMETIC_BOX_DROPS) {
      const key = drop.kind === 'item' ? `item:${drop.rarity}` : `${drop.kind}:${drop.amount}`;
      const expected = (drop.weight / 100) * N;
      const actual = counts.get(key) ?? 0;
      expect(actual).toBeGreaterThan(expected * 0.8);
      expect(actual).toBeLessThan(expected * 1.2);
    }
  });
});

describe('openCosmeticBox action', () => {
  beforeEach(reset);

  it('returns null when gold insufficient', () => {
    const result = useGameStore.getState().openCosmeticBox('character');
    expect(result).toBeNull();
  });

  it('debits COSMETIC_BOX_COST gold on successful open', () => {
    useGameStore.setState((s) => ({ state: { ...s.state, gold: 500 } }));
    useGameStore.getState().openCosmeticBox('character');
    // Spend 100 but some drops refund gold — net cost is between 50 and 100.
    const after = useGameStore.getState().state.gold;
    expect(after).toBeLessThanOrEqual(500);
    expect(after).toBeGreaterThanOrEqual(500 - COSMETIC_BOX_COST);
    expect(useGameStore.getState().state.stats.goldSpent).toBe(COSMETIC_BOX_COST);
  });

  it('adds character to inventory when item rolled', () => {
    useGameStore.setState((s) => ({ state: { ...s.state, gold: 100_000 } }));
    // Spam opens until we see an item (probability 40% per open).
    let sawItem = false;
    for (let i = 0; i < 200 && !sawItem; i++) {
      const r = useGameStore.getState().openCosmeticBox('character');
      if (r?.item) sawItem = true;
    }
    expect(sawItem).toBe(true);
    expect(useGameStore.getState().state.characters.length).toBeGreaterThan(0);
  });

  it('allows water drops to exceed MAX_WATER_DROPS from box drops', () => {
    useGameStore.setState((s) => ({
      state: { ...s.state, gold: 100_000, waterDrops: 95 },
    }));
    // Force many opens so we're likely to land a 'drops' outcome.
    let grew = false;
    for (let i = 0; i < 100; i++) {
      useGameStore.getState().openCosmeticBox('background');
      if (useGameStore.getState().state.waterDrops > 100) { grew = true; break; }
    }
    expect(grew).toBe(true);
  });

  it('increments cosmeticBoxesOpened per type', () => {
    useGameStore.setState((s) => ({ state: { ...s.state, gold: 1000 } }));
    useGameStore.getState().openCosmeticBox('character');
    useGameStore.getState().openCosmeticBox('background');
    useGameStore.getState().openCosmeticBox('character');
    const stats = useGameStore.getState().state.stats;
    expect(stats.cosmeticBoxesOpened.character).toBe(2);
    expect(stats.cosmeticBoxesOpened.background).toBe(1);
  });
});

describe('equip actions', () => {
  beforeEach(reset);

  it('refuses to equip unowned character', () => {
    useGameStore.getState().equipCharacter(0);
    expect(useGameStore.getState().state.equippedCharacterId).toBeNull();
  });

  it('equips an owned character', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        characters: [{ id: 0, count: 1, firstObtainedAt: Date.now() }],
      },
    }));
    useGameStore.getState().equipCharacter(0);
    expect(useGameStore.getState().state.equippedCharacterId).toBe(0);
  });

  it('unequips with null', () => {
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        characters: [{ id: 0, count: 1, firstObtainedAt: Date.now() }],
        equippedCharacterId: 0,
      },
    }));
    useGameStore.getState().equipCharacter(null);
    expect(useGameStore.getState().state.equippedCharacterId).toBeNull();
  });
});

describe('harvest gold grant', () => {
  beforeEach(reset);

  it('grants gold matching the harvested rarity', () => {
    const before = useGameStore.getState().state.gold;
    // Force a harvest-ready tree then water once.
    useGameStore.setState((s) => ({
      state: {
        ...s.state,
        waterDrops: 5,
        activeTree: {
          id: 'test',
          seed: 0,
          speciesId: 0,
          rarity: 'rare',
          requiredWaterings: 1,
          currentWaterings: 0,
          plantedAt: Date.now(),
          harvestedAt: null,
        },
      },
    }));
    const result = useGameStore.getState().waterTree();
    expect(result.ok).toBe(true);
    expect(result.goldGained).toBe(5); // GOLD_HARVEST_RARE
    expect(useGameStore.getState().state.gold).toBe(before + 5);
  });
});
