import { describe, expect, it } from "vitest";

import type { PomodoroSession } from "../types";
import {
  getCalendarHeatmapStats,
  getDailyFocusStats,
  getStreakStats,
  getTodaySessions,
  getTotalFocusMinutes
} from "./statsUtils";

const sessions: PomodoroSession[] = [
  {
    completedAt: "2026-05-08T09:00:00.000Z",
    durationSeconds: 1500,
    id: "today-1",
    taskId: "task-1",
    taskTitle: "Write"
  },
  {
    completedAt: "2026-05-07T09:00:00.000Z",
    durationSeconds: 1800,
    id: "yesterday-1",
    taskId: null,
    taskTitle: null
  },
  {
    completedAt: "2026-05-06T09:00:00.000Z",
    durationSeconds: 900,
    id: "before-1",
    taskId: null,
    taskTitle: null
  }
];

describe("statsUtils", () => {
  it("counts today and total focus minutes", () => {
    const now = new Date("2026-05-08T12:00:00.000Z");

    expect(getTodaySessions(sessions, now)).toHaveLength(1);
    expect(getTotalFocusMinutes(sessions)).toBe(70);
  });

  it("builds daily and heatmap stats over fixed windows", () => {
    const now = new Date("2026-05-08T12:00:00.000Z");
    const daily = getDailyFocusStats(sessions, 3, now, "en");
    const heatmap = getCalendarHeatmapStats(sessions, 3, now, "en");

    expect(daily.map((day) => day.minutes)).toEqual([15, 30, 25]);
    expect(heatmap).toHaveLength(3);
    expect(heatmap[2]).toMatchObject({
      date: "2026-05-08",
      intensity: 4,
      minutes: 25,
      sessions: 1
    });
  });

  it("calculates active and best streaks", () => {
    const streak = getStreakStats(
      sessions,
      new Date("2026-05-08T12:00:00.000Z")
    );

    expect(streak).toEqual({
      activeToday: true,
      bestStreak: 3,
      currentStreak: 3
    });
  });
});
