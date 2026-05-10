import { describe, expect, it } from "vitest";

import {
  MAX_TASK_NOTES_LENGTH,
  normalizeEstimatedPomodoros,
  normalizeTaskNotes,
  normalizeTaskPriority,
  normalizeTaskTitle
} from "./taskValidation";

describe("taskValidation", () => {
  it("trims and collapses task title whitespace", () => {
    expect(normalizeTaskTitle("  Write    more   tests  ")).toBe(
      "Write more tests"
    );
  });

  it("trims notes and limits them to the maximum length", () => {
    const notes = ` ${"a".repeat(MAX_TASK_NOTES_LENGTH + 5)} `;

    expect(normalizeTaskNotes(notes)).toHaveLength(MAX_TASK_NOTES_LENGTH);
  });

  it("rounds finite pomodoro estimates", () => {
    expect(normalizeEstimatedPomodoros(2.6)).toBe(3);
  });

  it("clamps pomodoro estimates into the allowed range", () => {
    expect(normalizeEstimatedPomodoros(-4)).toBe(1);
    expect(normalizeEstimatedPomodoros(99)).toBe(12);
  });

  it("falls back to one pomodoro for non-finite estimates", () => {
    expect(normalizeEstimatedPomodoros(Number.NaN)).toBe(1);
  });

  it("falls back to medium for invalid priority values", () => {
    expect(normalizeTaskPriority("urgent")).toBe("medium");
    expect(normalizeTaskPriority("high")).toBe("high");
  });
});
