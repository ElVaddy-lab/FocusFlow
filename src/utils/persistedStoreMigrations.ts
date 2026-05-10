import type {
  AppLanguage,
  AudioSettings,
  AutoStartMode,
  BlockedSite,
  DailyFocusGoal,
  FocusGoalMode,
  PersistedStoreKey,
  PomodoroSession,
  Task,
  TaskPriority,
  TaskStatus,
  ThemeMode,
  TimerDurations,
  TimerMode
} from "../types";
import { createBlockedSite } from "./blockerUtils";
import { createTaskId } from "./createTaskId";
import { DEFAULT_DAILY_FOCUS_GOAL } from "./goalUtils";
import {
  normalizeEstimatedPomodoros,
  normalizeTaskNotes,
  normalizeTaskPriority,
  normalizeTaskTitle
} from "./taskValidation";
import { DEFAULT_TIMER_DURATIONS } from "./timerUtils";

const STORE_VERSION = 1;

interface PersistedStorageValue {
  state: unknown;
  version?: number;
}

const autoStartModes = new Set<AutoStartMode>(["manual", "breaks", "all"]);
const focusGoalModes = new Set<FocusGoalMode>(["minutes", "pomodoros"]);
const taskPriorities = new Set<TaskPriority>(["low", "medium", "high"]);
const taskStatuses = new Set<TaskStatus>(["todo", "completed"]);
const themeModes = new Set<ThemeMode>(["light", "dark"]);
const timerModes = new Set<TimerMode>(["work", "shortBreak", "longBreak"]);
const languages = new Set<AppLanguage>(["en", "uk"]);

export function sanitizePersistedStoreState(
  key: PersistedStoreKey,
  state: unknown
): unknown {
  switch (key) {
    case "focusflow-audio-settings":
      return sanitizeAudioSettingsState(state);
    case "focusflow-goal":
      return sanitizeGoalState(state);
    case "focusflow-language":
      return sanitizeLanguageState(state);
    case "focusflow-stats":
      return sanitizeStatsState(state);
    case "focusflow-strict-mode":
      return sanitizeStrictModeState(state);
    case "focusflow-tasks":
      return sanitizeTaskState(state);
    case "focusflow-theme":
      return sanitizeThemeState(state);
    case "focusflow-timer":
      return sanitizeTimerState(state);
  }
}

function sanitizeAudioSettingsState(state: unknown): AudioSettings {
  const record = isRecord(state) ? state : {};

  return {
    enabled: record.enabled !== false,
    volume: clampNumber(record.volume, 0, 1, 0.6)
  };
}

export function sanitizePersistedStoreValue(
  key: PersistedStoreKey,
  value: string
): string | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    const storageValue = getStorageValue(parsed);

    if (!storageValue) {
      return null;
    }

    return JSON.stringify({
      state: sanitizePersistedStoreState(key, storageValue.state),
      version:
        typeof storageValue.version === "number"
          ? storageValue.version
          : STORE_VERSION
    });
  } catch {
    return null;
  }
}

export function migratePersistedStoreState(
  key: PersistedStoreKey,
  persistedState: unknown
): unknown {
  return sanitizePersistedStoreState(key, persistedState);
}

function getStorageValue(value: unknown): PersistedStorageValue | null {
  if (!isRecord(value)) {
    return null;
  }

  if ("state" in value) {
    return {
      state: value.state,
      version: typeof value.version === "number" ? value.version : STORE_VERSION
    };
  }

  return { state: value, version: 0 };
}

function sanitizeThemeState(state: unknown): { mode: ThemeMode } {
  const record = isRecord(state) ? state : {};
  return {
    mode: themeModes.has(record.mode as ThemeMode)
      ? (record.mode as ThemeMode)
      : "light"
  };
}

function sanitizeLanguageState(state: unknown): { language: AppLanguage } {
  const record = isRecord(state) ? state : {};
  return {
    language: languages.has(record.language as AppLanguage)
      ? (record.language as AppLanguage)
      : "en"
  };
}

function sanitizeGoalState(state: unknown): DailyFocusGoal {
  const record = isRecord(state) ? state : {};
  return {
    mode: focusGoalModes.has(record.mode as FocusGoalMode)
      ? (record.mode as FocusGoalMode)
      : DEFAULT_DAILY_FOCUS_GOAL.mode,
    targetMinutes: clampInteger(record.targetMinutes, 1, 1440, 120),
    targetPomodoros: clampInteger(record.targetPomodoros, 1, 48, 4)
  };
}

function sanitizeTaskState(state: unknown): { tasks: Task[] } {
  const record = isRecord(state) ? state : {};
  const tasks = Array.isArray(record.tasks) ? record.tasks : [];

  return {
    tasks: tasks.map((task, index) => sanitizeTask(task, index))
  };
}

function sanitizeTask(task: unknown, index: number): Task {
  const record = isRecord(task) ? task : {};
  const title = normalizeTaskTitle(
    typeof record.title === "string" ? record.title : ""
  );

  return {
    estimatedPomodoros: normalizeEstimatedPomodoros(
      Number(record.estimatedPomodoros)
    ),
    id: typeof record.id === "string" && record.id ? record.id : createTaskId(),
    isToday: record.isToday === true,
    notes: normalizeTaskNotes(
      typeof record.notes === "string" ? record.notes : ""
    ),
    priority: taskPriorities.has(record.priority as TaskPriority)
      ? (record.priority as TaskPriority)
      : normalizeTaskPriority(record.priority),
    status: taskStatuses.has(record.status as TaskStatus)
      ? (record.status as TaskStatus)
      : "todo",
    title: title || "Untitled task",
    todayOrder: Number.isFinite(record.todayOrder)
      ? Number(record.todayOrder)
      : index
  };
}

function sanitizeTimerState(state: unknown): {
  activeTaskId: string | null;
  autoStartMode: AutoStartMode;
  durations: TimerDurations;
} {
  const record = isRecord(state) ? state : {};
  const durations = isRecord(record.durations) ? record.durations : {};

  return {
    activeTaskId:
      typeof record.activeTaskId === "string" ? record.activeTaskId : null,
    autoStartMode: autoStartModes.has(record.autoStartMode as AutoStartMode)
      ? (record.autoStartMode as AutoStartMode)
      : "manual",
    durations: {
      work: sanitizeDuration(durations.work, DEFAULT_TIMER_DURATIONS.work),
      shortBreak: sanitizeDuration(
        durations.shortBreak,
        DEFAULT_TIMER_DURATIONS.shortBreak
      ),
      longBreak: sanitizeDuration(
        durations.longBreak,
        DEFAULT_TIMER_DURATIONS.longBreak
      )
    }
  };
}

function sanitizeStatsState(state: unknown): { sessions: PomodoroSession[] } {
  const record = isRecord(state) ? state : {};
  const sessions = Array.isArray(record.sessions) ? record.sessions : [];

  return {
    sessions: sessions
      .map((session) => sanitizeSession(session))
      .filter((session): session is PomodoroSession => Boolean(session))
  };
}

function sanitizeSession(session: unknown): PomodoroSession | null {
  const record = isRecord(session) ? session : {};

  if (
    typeof record.id !== "string" ||
    typeof record.completedAt !== "string" ||
    Number.isNaN(Date.parse(record.completedAt))
  ) {
    return null;
  }

  return {
    completedAt: record.completedAt,
    durationSeconds: sanitizeDuration(record.durationSeconds, 0),
    id: record.id,
    taskId: typeof record.taskId === "string" ? record.taskId : null,
    taskTitle: typeof record.taskTitle === "string" ? record.taskTitle : null
  };
}

function sanitizeStrictModeState(state: unknown): {
  blockedSites: BlockedSite[];
  enabled: boolean;
  lockedResetAttempts: number;
} {
  const record = isRecord(state) ? state : {};
  const blockedSites = Array.isArray(record.blockedSites)
    ? record.blockedSites
    : [];

  return {
    blockedSites: blockedSites
      .map((site) =>
        isRecord(site) ? createBlockedSite(String(site.domain ?? site.id)) : null
      )
      .filter((site): site is BlockedSite => Boolean(site)),
    enabled: record.enabled === true,
    lockedResetAttempts: clampInteger(record.lockedResetAttempts, 0, 100000, 0)
  };
}

function sanitizeDuration(value: unknown, fallback: number): number {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 1) {
    return fallback;
  }

  return Math.min(86400, Math.round(numberValue));
}

function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(numberValue)));
}

function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numberValue));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
