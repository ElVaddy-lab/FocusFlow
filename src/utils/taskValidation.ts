import type { TaskPriority } from "../types";

export const MIN_ESTIMATED_POMODOROS = 1;
export const MAX_ESTIMATED_POMODOROS = 12;
export const MAX_TASK_NOTES_LENGTH = 1000;

export const TASK_PRIORITIES: TaskPriority[] = ["high", "medium", "low"];

export function normalizeTaskTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ");
}

export function normalizeTaskNotes(notes: string): string {
  return notes.trim().slice(0, MAX_TASK_NOTES_LENGTH);
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

export function normalizeTaskPriority(value: unknown): TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority)
    ? (value as TaskPriority)
    : "medium";
}
