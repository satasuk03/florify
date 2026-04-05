import { describe, expect, it } from 'vitest';
import { mulberry32, randInt, randPick, randRange } from '@/engine/rng';

describe('mulberry32', () => {
  it('is deterministic for the same seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });

  it('differs for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });

  it('stays in [0, 1)', () => {
    const r = mulberry32(0xc0ffee);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('handles seed = 0', () => {
    const r = mulberry32(0);
    const v = r();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });
});

describe('helpers', () => {
  it('randRange stays within bounds', () => {
    const r = mulberry32(123);
    for (let i = 0; i < 500; i++) {
      const v = randRange(r, 5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThan(10);
    }
  });

  it('randInt is inclusive on both ends', () => {
    const r = mulberry32(7);
    let sawMin = false;
    let sawMax = false;
    for (let i = 0; i < 1000; i++) {
      const v = randInt(r, 1, 3);
      if (v === 1) sawMin = true;
      if (v === 3) sawMax = true;
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(3);
    }
    expect(sawMin).toBe(true);
    expect(sawMax).toBe(true);
  });

  it('randPick picks a member of the array', () => {
    const r = mulberry32(99);
    const items = ['a', 'b', 'c'] as const;
    for (let i = 0; i < 50; i++) {
      const v = randPick(r, items);
      expect(items).toContain(v);
    }
  });

  it('randPick throws on empty array', () => {
    const r = mulberry32(1);
    expect(() => randPick(r, [])).toThrow();
  });
});
