/**
 * Client-side roadmap completion tracking.
 *
 * The backend recommendation engine has no notion of "module progress" — it
 * only emits the roadmap topics themselves (`GET /recommendations`). Rather
 * than ship a progress bar that fakes a number, completion is recorded here in
 * localStorage so the roadmap timeline, the completion percentage and the
 * "Mark Complete" actions all reflect what the user actually ticked off.
 *
 * Mirrors the storage pattern used by `lib/practiceTime.ts`.
 */
const STORAGE_KEY = 'designo_roadmap_completed_v1';

/** Topic ids the learner has marked as completed, de-duplicated. */
export function readCompletedModules(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((item): item is string => typeof item === 'string' && item.length > 0))];
  } catch {
    // Storage unavailable (private mode / corrupt payload).
    return [];
  }
}

/** Persist the full set of completed topic ids. */
export function writeCompletedModules(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // Storage unavailable (private mode / quota) — tracking silently degrades.
  }
}
