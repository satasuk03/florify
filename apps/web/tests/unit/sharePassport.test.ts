import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sharePassport } from '@/components/florist-card/sharePassport';
import type { FloristCardData } from '@/store/gameStore';

/**
 * sharePassport has four observable outcomes — this suite covers all
 * four by mocking renderPassportImage + navigator.canShare/share.
 *
 * We don't exercise the real Canvas 2D renderer here (jsdom has no
 * WebGL/canvas backing); that's covered by manual testing on device.
 */

vi.mock('@/components/florist-card/renderPassportImage', () => ({
  renderPassportImage: vi.fn(async () => new Blob(['fake png data'], { type: 'image/png' })),
}));

const sampleData: FloristCardData = {
  rank: 'Seedling',
  speciesUnlocked: 0,
  totalHarvested: 0,
  currentStreak: 0,
  longestStreak: 0,
  rarityProgress: {
    common: { unlocked: 0, total: 200 },
    rare: { unlocked: 0, total: 80 },
    legendary: { unlocked: 0, total: 20 },
  },
  startedAt: 0,
  serial: 'FL-TEST-0001',
  displayName: 'Guest',
  title: 'Seedling',
  avatar: null,
};

describe('sharePassport', () => {
  const originalNavigator = globalThis.navigator;
  let mockNavigator: {
    canShare?: ReturnType<typeof vi.fn>;
    share?: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockNavigator = {};
    Object.defineProperty(globalThis, 'navigator', {
      value: { ...originalNavigator, ...mockNavigator },
      configurable: true,
    });
    // jsdom doesn't implement Blob → URL.createObjectURL, stub it
    URL.createObjectURL = vi.fn(() => 'blob:stub');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  function setNavigator(nav: Partial<Navigator>) {
    Object.defineProperty(globalThis, 'navigator', {
      value: { ...originalNavigator, ...nav },
      configurable: true,
    });
  }

  it('returns { kind: "shared" } when navigator.share resolves', async () => {
    const share = vi.fn(async () => undefined);
    const canShare = vi.fn(() => true);
    setNavigator({ canShare, share });

    const result = await sharePassport(sampleData);
    expect(result).toEqual({ kind: 'shared' });
    expect(share).toHaveBeenCalledOnce();
  });

  it('returns { kind: "cancelled" } when user aborts the share sheet', async () => {
    const share = vi.fn(async () => {
      throw new DOMException('cancelled', 'AbortError');
    });
    const canShare = vi.fn(() => true);
    setNavigator({ canShare, share });

    const result = await sharePassport(sampleData);
    expect(result).toEqual({ kind: 'cancelled' });
  });

  it('falls back to download when navigator.canShare returns false', async () => {
    const canShare = vi.fn(() => false);
    setNavigator({ canShare, share: vi.fn() });

    // Stub anchor click so jsdom doesn't try to actually navigate
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const result = await sharePassport(sampleData);
    expect(result.kind).toBe('downloaded');
    if (result.kind === 'downloaded') {
      expect(result.filename).toBe('florify-passport-FL-TEST-0001.png');
    }
    expect(clickSpy).toHaveBeenCalledOnce();
    clickSpy.mockRestore();
  });

  it('falls back to download when canShare is unavailable entirely', async () => {
    setNavigator({});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const result = await sharePassport(sampleData);
    expect(result.kind).toBe('downloaded');
    clickSpy.mockRestore();
  });

  it('returns { kind: "error" } when renderPassportImage throws', async () => {
    const mod = await import('@/components/florist-card/renderPassportImage');
    vi.mocked(mod.renderPassportImage).mockRejectedValueOnce(new Error('canvas unavailable'));

    const result = await sharePassport(sampleData);
    expect(result.kind).toBe('error');
    if (result.kind === 'error') {
      expect(result.message).toBe('canvas unavailable');
    }
  });
});
