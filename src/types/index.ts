export type ThemeMode = "light" | "dark";

export type AppLanguage = "en" | "uk";

export type NavigationSection = "dashboard" | "timer" | "settings";

export interface NavigationItem {
  id: NavigationSection;
  label: string;
  description: string;
}

export type TaskStatus = "todo" | "completed";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  estimatedPomodoros: number;
}

export interface TaskInput {
  title: string;
  estimatedPomodoros: number;
}

export type TimerMode = "work" | "shortBreak" | "longBreak";

export type TimerStatus = "idle" | "running" | "paused";

export type TimerDurations = Record<TimerMode, number>;

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

export interface StreakStats {
  activeToday: boolean;
  bestStreak: number;
  currentStreak: number;
}
