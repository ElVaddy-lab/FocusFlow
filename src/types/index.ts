export type ThemeMode = "light" | "dark";

export type AppLanguage = "en" | "uk";

export type NavigationSection = "dashboard" | "timer" | "settings";

export interface NavigationItem {
  id: NavigationSection;
  label: string;
  description: string;
}

export type TaskStatus = "todo" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  estimatedPomodoros: number;
  id: string;
  isToday: boolean;
  notes: string;
  priority: TaskPriority;
  title: string;
  status: TaskStatus;
  todayOrder: number;
}

export interface TaskInput {
  estimatedPomodoros: number;
  notes: string;
  priority: TaskPriority;
  title: string;
}

export type TimerMode = "work" | "shortBreak" | "longBreak";

export type AutoStartMode = "manual" | "breaks" | "all";

export type TimerStatus = "idle" | "running" | "paused";

export type TimerDurations = Record<TimerMode, number>;

export type TimerCommand = "pause" | "reset" | "showMain" | "start";

export interface TimerSnapshot {
  activeTaskTitle: string | null;
  formattedTime: string;
  mode: TimerMode;
  remainingSeconds: number;
  status: TimerStatus;
}

export type FocusGoalMode = "minutes" | "pomodoros";

export interface DailyFocusGoal {
  mode: FocusGoalMode;
  targetMinutes: number;
  targetPomodoros: number;
}

export interface TimerModeOption {
  id: TimerMode;
}

export interface BlockedSite {
  id: string;
  domain: string;
}

export interface CompletedPomodoroEvent {
  id: string;
  completedAt: string;
  durationSeconds: number;
  taskId: string | null;
}

export interface CompletedTimerEvent {
  id: string;
  completedAt: string;
  durationSeconds: number;
  mode: TimerMode;
  nextMode: TimerMode;
  taskId: string | null;
}

export interface PomodoroSession {
  id: string;
  completedAt: string;
  durationSeconds: number;
  taskId: string | null;
  taskTitle: string | null;
}

export interface DailyFocusStat {
  date: string;
  label: string;
  minutes: number;
  sessions: number;
}

export interface HeatmapDay {
  date: string;
  intensity: number;
  label: string;
  minutes: number;
  sessions: number;
}

export interface StreakStats {
  activeToday: boolean;
  bestStreak: number;
  currentStreak: number;
}
