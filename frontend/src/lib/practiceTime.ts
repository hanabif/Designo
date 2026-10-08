/**
 * Practice-time tracking.
 *
 * Time is accumulated per interview (1 second per tick) while the interview
 * screen is open and the session is IN_PROGRESS, then persisted in
 * localStorage so the dashboard can show a lifetime total and per-session
 * durations without requiring any backend schema changes.
 */
const STORAGE_KEY = 'designo_practice_time_v1';

type PracticeMap = Record<string, number>; // interviewId -> seconds

function readAll(): PracticeMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as PracticeMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: PracticeMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage unavailable (private mode/quota) — tracking silently degrades.
  }
}

/** Add tracked seconds for one interview. */
export function addPracticeSeconds(interviewId: string, seconds: number): void {
  if (!interviewId || !Number.isFinite(seconds) || seconds <= 0) return;
  const all = readAll();
  all[interviewId] = (all[interviewId] || 0) + seconds;
  writeAll(all);
}

/** Tracked seconds for a single interview (0 when never tracked). */
export function getPracticeSeconds(interviewId: string): number {
  if (!interviewId) return 0;
  return readAll()[interviewId] || 0;
}

/** Lifetime tracked seconds across every interview. */
export function getTotalPracticeSeconds(): number {
  return Object.values(readAll()).reduce((sum, seconds) => sum + (Number.isFinite(seconds) ? seconds : 0), 0);
}

/** Human-readable duration, e.g. "45 min", "1h 12m", "<1 min". */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '<1 min';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes} min`;
  return '<1 min';
}