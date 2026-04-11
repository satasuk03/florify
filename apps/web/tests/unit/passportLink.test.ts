// @vitest-environment node
// (jsdom's Blob lacks .stream() which saveTransfer.gzip depends on)
import { describe, expect, it } from 'vitest';
import {
  decodePassportLink,
  encodePassportPayload,
} from '@/lib/passportLink';
import type { FloristCardData } from '@/store/gameStore';

const base: FloristCardData = {
  rank: 'Apprentice',
  speciesUnlocked: 42,
  totalHarvested: 100,
  currentStreak: 5,
  longestStreak: 10,
  rarityProgress: {
    common: { unlocked: 20, total: 100 },
    rare: { unlocked: 15, total: 100 },
    legendary: { unlocked: 7, total: 50 },
  },
  startedAt: 1700000000000,
  serial: 'FL-ABCD-EFGH',
  displayName: 'Tester',
  title: 'Apprentice',
  avatar: null,
};

describe('passportLink round-trip with customization', () => {
  it('round-trips a custom title and avatar', async () => {
    const data: FloristCardData = {
      ...base,
      title: '📗 Apprentice Botanist',
      avatar: { speciesId: 1, stage: 3 },
    };
    const body = await encodePassportPayload(data);
    const decoded = await decodePassportLink(body);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.data.title).toBe('📗 Apprentice Botanist');
      expect(decoded.data.avatar).toEqual({ speciesId: 1, stage: 3 });
    }
  });

  it('falls back to rank when ti is omitted (auto mode)', async () => {
    const data: FloristCardData = { ...base, title: 'Apprentice' };
    const body = await encodePassportPayload(data);
    const decoded = await decodePassportLink(body);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.data.title).toBe('Apprentice');
    }
  });

  it('decodes a link without customization as title=rank, avatar=null', async () => {
    const data: FloristCardData = { ...base };
    const body = await encodePassportPayload(data);
    const decoded = await decodePassportLink(body);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.data.title).toBe(decoded.data.rank);
      expect(decoded.data.avatar).toBeNull();
    }
  });

  it('falls back to null avatar when speciesId is unknown', async () => {
    const data: FloristCardData = {
      ...base,
      avatar: { speciesId: 999999, stage: 1 },
    };
    const body = await encodePassportPayload(data);
    const decoded = await decodePassportLink(body);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.data.avatar).toBeNull();
    }
  });

  it('falls back to null avatar on invalid stage', async () => {
    const data: FloristCardData = {
      ...base,
      // @ts-expect-error — deliberately invalid
      avatar: { speciesId: 1, stage: 9 },
    };
    const body = await encodePassportPayload(data);
    const decoded = await decodePassportLink(body);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.data.avatar).toBeNull();
    }
  });
});
