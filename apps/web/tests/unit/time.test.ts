import { describe, expect, it } from 'vitest';
import { formatDuration, isYesterday, todayLocalDate } from '@/lib/time';

describe('todayLocalDate', () => {
  it('formats as YYYY-MM-DD with zero padding', () => {
    const d = new Date(2026, 0, 5); // 2026-01-05 local
    expect(todayLocalDate(d)).toBe('2026-01-05');
  });

  it('zero-pads single-digit month and day', () => {
    const d = new Date(2026, 8, 9); // 2026-09-09 local
    expect(todayLocalDate(d)).toBe('2026-09-09');
  });
});

describe('isYesterday', () => {
  it('returns true when the previous date is exactly one day before', () => {
    expect(isYesterday('2026-04-04', '2026-04-05')).toBe(true);
  });

  it('returns false for same day', () => {
    expect(isYesterday('2026-04-05', '2026-04-05')).toBe(false);
  });

  it('returns false for two days ago', () => {
    expect(isYesterday('2026-04-03', '2026-04-05')).toBe(false);
  });

  it('returns false for empty prev date (first ever checkin)', () => {
    expect(isYesterday('', '2026-04-05')).toBe(false);
  });

  it('handles month boundaries', () => {
    expect(isYesterday('2026-03-31', '2026-04-01')).toBe(true);
  });

  it('handles year boundaries', () => {
    expect(isYesterday('2025-12-31', '2026-01-01')).toBe(true);
  });
});

describe('formatDuration', () => {
  it('returns Ready for <= 0', () => {
    expect(formatDuration(0)).toBe('Ready');
    expect(formatDuration(-100)).toBe('Ready');
  });

  it('formats minutes and seconds with zero-padded seconds', () => {
    expect(formatDuration(5_000)).toBe('0:05');
    expect(formatDuration(65_000)).toBe('1:05');
    expect(formatDuration(30 * 60 * 1000)).toBe('30:00');
  });
});
