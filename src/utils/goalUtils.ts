import type { DailyFocusGoal, FocusGoalMode } from "../types";

export const DEFAULT_DAILY_FOCUS_GOAL: DailyFocusGoal = {
  mode: "minutes",
  targetMinutes: 120,
  targetPomodoros: 4
};

export const MIN_DAILY_GOAL_MINUTES = 1;
export const MAX_DAILY_GOAL_MINUTES = 1440;
export const MIN_DAILY_GOAL_POMODOROS = 1;
export const MAX_DAILY_GOAL_POMODOROS = 48;

export interface DailyGoalProgress {
  current: number;
  isComplete: boolean;
  percent: number;
  remaining: number;
  target: number;
}

export function getDailyGoalTarget(goal: DailyFocusGoal): number {
  return goal.mode === "minutes"
    ? goal.targetMinutes
    : goal.targetPomodoros;
}

export function getDailyGoalCurrent(
  goalMode: FocusGoalMode,
  todayMinutes: number,
  todayPomodoros: number
): number {
  return goalMode === "minutes" ? todayMinutes : todayPomodoros;
}

export function getDailyGoalProgress(
  goal: DailyFocusGoal,
  todayMinutes: number,
  todayPomodoros: number
): DailyGoalProgress {
  const target = getDailyGoalTarget(goal);
  const current = getDailyGoalCurrent(
    goal.mode,
    todayMinutes,
    todayPomodoros
  );
  const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  return {
    current,
    isComplete: current >= target,
    percent,
    remaining: Math.max(0, target - current),
    target
  };
}

export function isValidDailyGoalValue(
  mode: FocusGoalMode,
  value: number
): boolean {
  if (!Number.isInteger(value)) {
    return false;
  }

  if (mode === "minutes") {
    return value >= MIN_DAILY_GOAL_MINUTES && value <= MAX_DAILY_GOAL_MINUTES;
  }

  return (
    value >= MIN_DAILY_GOAL_POMODOROS && value <= MAX_DAILY_GOAL_POMODOROS
  );
}
