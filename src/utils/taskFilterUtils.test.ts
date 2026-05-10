import { describe, expect, it } from "vitest";

import type { Task, TaskFilterState } from "../types";
import { filterTasks } from "./taskFilterUtils";

const defaultFilters: TaskFilterState = {
  priority: "all",
  query: "",
  status: "all",
  today: "all"
};

const tasks: Task[] = [
  {
    estimatedPomodoros: 2,
    id: "task-1",
    isToday: true,
    notes: "Draft report outline",
    priority: "high",
    status: "todo",
    title: "Write proposal",
    todayOrder: 1
  },
  {
    estimatedPomodoros: 1,
    id: "task-2",
    isToday: false,
    notes: "Call finance team",
    priority: "medium",
    status: "completed",
    title: "Budget review",
    todayOrder: 2
  },
  {
    estimatedPomodoros: 3,
    id: "task-3",
    isToday: true,
    notes: "",
    priority: "low",
    status: "todo",
    title: "Refactor timer",
    todayOrder: 3
  }
];

function ids(filteredTasks: Task[]): string[] {
  return filteredTasks.map((task) => task.id);
}

describe("taskFilterUtils", () => {
  it("returns all tasks for empty default filters", () => {
    expect(ids(filterTasks(tasks, defaultFilters))).toEqual([
      "task-1",
      "task-2",
      "task-3"
    ]);
  });

  it("matches query text against task titles case-insensitively", () => {
    expect(ids(filterTasks(tasks, { ...defaultFilters, query: "WRITE" }))).toEqual([
      "task-1"
    ]);
  });

  it("matches query text against task notes", () => {
    expect(ids(filterTasks(tasks, { ...defaultFilters, query: "finance" }))).toEqual([
      "task-2"
    ]);
  });

  it("filters by priority", () => {
    expect(ids(filterTasks(tasks, { ...defaultFilters, priority: "low" }))).toEqual([
      "task-3"
    ]);
  });

  it("filters by completion status", () => {
    expect(ids(filterTasks(tasks, { ...defaultFilters, status: "completed" }))).toEqual([
      "task-2"
    ]);
  });

  it("filters by today queue membership", () => {
    expect(ids(filterTasks(tasks, { ...defaultFilters, today: "notToday" }))).toEqual([
      "task-2"
    ]);
  });

  it("combines query, priority, status, and today filters", () => {
    expect(
      ids(
        filterTasks(tasks, {
          priority: "high",
          query: "report",
          status: "todo",
          today: "today"
        })
      )
    ).toEqual(["task-1"]);
  });
});
