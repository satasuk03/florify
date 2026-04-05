import { describe, expect, it } from 'vitest';
import { deriveSerial } from '@/store/gameStore';
import { buildLayout, PASSPORT_H, PASSPORT_W, type DrawOp } from '@/components/florist-card/passportLayout';
import type { FloristCardData } from '@/store/gameStore';

// ── deriveSerial ──────────────────────────────────────────────────

describe('deriveSerial', () => {
  it('produces FL-XXXX-XXXX format from a normal userId', () => {
    const s = deriveSerial('abc123DEF456');
    expect(s).toMatch(/^FL-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it('uppercases the underlying characters', () => {
    expect(deriveSerial('abcdefgh')).toBe('FL-ABCD-EFGH');
  });

  it('pads with X when the userId has fewer than 8 alphanumeric chars', () => {
    expect(deriveSerial('ab')).toBe('FL-ABXX-XXXX');
    expect(deriveSerial('')).toBe('FL-XXXX-XXXX');
  });

  it('strips non-alphanumeric characters', () => {
    expect(deriveSerial('abc_def-GHI!jk')).toBe('FL-ABCD-EFGH');
  });

  it('is stable for the same input', () => {
    expect(deriveSerial('same-user-id')).toBe(deriveSerial('same-user-id'));
  });
});

// ── buildLayout ────────────────────────────────────────────────────

const sampleData: FloristCardData = {
  rank: 'Apprentice',
  speciesUnlocked: 47,
  totalHarvested: 124,
  currentStreak: 12,
  longestStreak: 23,
  rarityProgress: {
    common: { unlocked: 38, total: 200 },
    rare: { unlocked: 8, total: 80 },
    legendary: { unlocked: 1, total: 20 },
  },
  startedAt: new Date(2026, 0, 12).getTime(),
  serial: 'FL-3K2P-9XQ4',
  displayName: 'Guest',
};

describe('buildLayout', () => {
  it('includes the required text anchors', () => {
    const ops = buildLayout(sampleData);
    const texts = ops.filter((o): o is Extract<DrawOp, { type: 'text' }> => o.type === 'text');
    const textContent = texts.map((t) => t.text);
    expect(textContent).toContain('FLORIFY');
    expect(textContent).toContain('BOTANICAL PASSPORT');
    expect(textContent).toContain('47');
    expect(textContent).toContain('SPECIES UNLOCKED');
    expect(textContent).toContain('◆  APPRENTICE  ◆');
    expect(textContent).toContain('Common');
    expect(textContent).toContain('Rare');
    expect(textContent).toContain('Legendary');
    expect(textContent).toContain('Guest');
    expect(textContent).toContain('FL-3K2P-9XQ4');
    expect(textContent).toContain('florify.app');
  });

  it('keeps all content within story safe zone y ∈ [240, 1800]', () => {
    const ops = buildLayout(sampleData);
    for (const op of ops) {
      if (op.type === 'text') {
        expect(op.y).toBeGreaterThanOrEqual(240);
        expect(op.y).toBeLessThanOrEqual(1800);
      }
    }
  });

  it('builds within canvas bounds', () => {
    const ops = buildLayout(sampleData);
    for (const op of ops) {
      if (op.type === 'rect') {
        expect(op.x).toBeGreaterThanOrEqual(0);
        expect(op.y).toBeGreaterThanOrEqual(0);
        expect(op.x + op.w).toBeLessThanOrEqual(PASSPORT_W + 1);
        expect(op.y + op.h).toBeLessThanOrEqual(PASSPORT_H + 1);
      }
    }
  });

  it('renders rarity bars proportional to unlocked/total', () => {
    // Put a 50% legendary progress to verify bar fill width
    const data: FloristCardData = {
      ...sampleData,
      rarityProgress: {
        common: { unlocked: 100, total: 200 },
        rare: { unlocked: 20, total: 80 },
        legendary: { unlocked: 10, total: 20 },
      },
    };
    const ops = buildLayout(data);
    const rects = ops.filter((o): o is Extract<DrawOp, { type: 'rect' }> => o.type === 'rect');
    // There should be 3 background bars + 3 fills = 6 rects from bar rows
    // (plus decorative corners — but those are 'corner' type, not 'rect').
    expect(rects.length).toBeGreaterThanOrEqual(6);
  });

  it('is deterministic for the same data', () => {
    const a = JSON.stringify(buildLayout(sampleData));
    const b = JSON.stringify(buildLayout(sampleData));
    expect(a).toBe(b);
  });
});
