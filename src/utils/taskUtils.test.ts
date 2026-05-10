import { describe, expect, it } from "vitest";

import type { Task } from "../types";
import {
  getFirstTodayOrder,
  getNextTodayOrder,
  getTodayTasks,
  sortTasksForFocusSelect
} from "./taskUtils";

const tasks: Task[] = [
  {
    estimatedPomodoros: 1,
    id: "later",
    isToday: true,
    notes: "",
    priority: "medium",
    status: "todo",
    title: "Later",
    todayOrder: 20
  },
  {
    estimatedPomodoros: 1,
    id: "done",
    isToday: true,
    notes: "",
    priority: "high",
    status: "completed",
    title: "Done",
    todayOrder: 5
  },
  {
    estimatedPomodoros: 1,
    id: "first",
    isToday: true,
    notes: "",
    priority: "high",
    status: "todo",
    title: "First",
    todayOrder: 10
  },
  {
    estimatedPomodoros: 1,
    id: "backlog",
    isToday: false,
    notes: "",
    priority: "low",
    status: "todo",
    title: "Backlog",
    todayOrder: 0
  }
];

describe("taskUtils", () => {
  it("sorts active today tasks and excludes completed items", () => {
    expect(getTodayTasks(tasks).map((task) => task.id)).toEqual([
      "first",
      "later"
    ]);
  });

  it("calculates queue insertion orders", () => {
    expect(getFirstTodayOrder(tasks)).toBe(4);
    expect(getNextTodayOrder(tasks)).toBe(21);
  });

  it("keeps today tasks first in the focus selector", () => {
    expect(sortTasksForFocusSelect(tasks).map((task) => task.id)).toEqual([
      "first",
      "later",
      "backlog"
    ]);
  });
});
