import type { TimerDurations, TimerMode, TimerModeOption } from "../types";

export const DEFAULT_TIMER_DURATIONS: TimerDurations = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

export const TIMER_MODE_OPTIONS: TimerModeOption[] = [
  { id: "work" },
  { id: "shortBreak" },
  { id: "longBreak" }
];

export const MIN_TIMER_MINUTES = 1;
export const MAX_TIMER_MINUTES = 120;

export function formatSeconds(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function normalizeTimerMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) {
    return 25;
  }

  return Math.min(MAX_TIMER_MINUTES, Math.max(MIN_TIMER_MINUTES, minutes));
}

export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

export function minutesToSeconds(minutes: number): number {
  return Math.round(normalizeTimerMinutes(minutes) * 60);
}

export function getTimerProgress(
  remainingSeconds: number,
  durationSeconds: number
): number {
  if (durationSeconds <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, 1 - remainingSeconds / durationSeconds));
}

export function getNextTimerMode(
  mode: TimerMode,
  completedWorkSessions: number
): TimerMode {
  if (mode !== "work") {
    return "work";
  }

  return completedWorkSessions > 0 && completedWorkSessions % 4 === 0
    ? "longBreak"
    : "shortBreak";
}
