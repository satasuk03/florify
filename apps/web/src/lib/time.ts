/**
 * Time helpers for the game store.
 *
 * All date math runs in the player's local timezone — streaks are a
 * daily ritual, so "yesterday" is wall-clock yesterday, not
 * UTC-yesterday. We accept the edge case where travelling across
 * timezones can cost a streak day; matching the design in 05 §5.5.
 */

export function todayLocalDate(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isYesterday(prevDateStr: string, todayStr: string): boolean {
  if (!prevDateStr) return false;
  const today = new Date(`${todayStr}T00:00:00`);
  if (Number.isNaN(today.getTime())) return false;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, '0');
  const d = String(yesterday.getDate()).padStart(2, '0');
  return prevDateStr === `${y}-${m}-${d}`;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return 'Ready';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
