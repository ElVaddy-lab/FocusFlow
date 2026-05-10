export const MIN_ESTIMATED_POMODOROS = 1;
export const MAX_ESTIMATED_POMODOROS = 12;

export function normalizeTaskTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ");
}

export function normalizeEstimatedPomodoros(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_ESTIMATED_POMODOROS;
  }

  return Math.min(
    MAX_ESTIMATED_POMODOROS,
    Math.max(MIN_ESTIMATED_POMODOROS, Math.round(value))
  );
}
