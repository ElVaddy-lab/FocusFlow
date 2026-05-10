import { describe, expect, it } from "vitest";

import {
  migratePersistedStoreState,
  sanitizePersistedStoreValue
} from "./persistedStoreMigrations";

describe("persisted store migrations", () => {
  it("returns null for corrupt JSON in a single store", () => {
    expect(sanitizePersistedStoreValue("focusflow-tasks", "{")).toBeNull();
  });

  it("normalizes task payloads without dropping recoverable data", () => {
    const value = sanitizePersistedStoreValue(
      "focusflow-tasks",
      JSON.stringify({
        state: {
          tasks: [
            {
              estimatedPomodoros: 0,
              id: "task-1",
              isToday: true,
              notes: "note",
              priority: "urgent",
              status: "unknown",
              title: "  Write tests  ",
              todayOrder: "bad"
            }
          ]
        },
        version: 0
      })
    );

    expect(value).not.toBeNull();

    const parsed = JSON.parse(value ?? "{}") as {
      state: { tasks: Array<Record<string, unknown>> };
      version: number;
    };

    expect(parsed.version).toBe(0);
    expect(parsed.state.tasks[0]).toMatchObject({
      estimatedPomodoros: 1,
      id: "task-1",
      isToday: true,
      notes: "note",
      priority: "medium",
      status: "todo",
      title: "Write tests",
      todayOrder: 0
    });
  });

  it("normalizes timer state during Zustand migrations", () => {
    const migrated = migratePersistedStoreState("focusflow-timer", {
      activeTaskId: 42,
      autoStartMode: "always",
      durations: {
        longBreak: 900,
        shortBreak: -10,
        work: 1500
      }
    }) as {
      activeTaskId: string | null;
      autoStartMode: string;
      durations: Record<string, number>;
    };

    expect(migrated).toEqual({
      activeTaskId: null,
      autoStartMode: "manual",
      durations: {
        longBreak: 900,
        shortBreak: 300,
        work: 1500
      }
    });
  });

  it("drops invalid stat sessions but keeps valid sessions", () => {
    const value = sanitizePersistedStoreValue(
      "focusflow-stats",
      JSON.stringify({
        state: {
          sessions: [
            {
              completedAt: "2026-05-08T10:00:00.000Z",
              durationSeconds: 1500,
              id: "session-1",
              taskId: null,
              taskTitle: "Focus"
            },
            {
              completedAt: "not-a-date",
              durationSeconds: 1500,
              id: "session-2"
            }
          ]
        },
        version: 1
      })
    );

    const parsed = JSON.parse(value ?? "{}") as {
      state: { sessions: Array<Record<string, unknown>> };
    };

    expect(parsed.state.sessions).toHaveLength(1);
    expect(parsed.state.sessions[0].id).toBe("session-1");
  });
});
