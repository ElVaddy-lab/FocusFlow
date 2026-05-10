import { describe, expect, it } from "vitest";

import {
  formatSeconds,
  getNextTimerMode,
  getTimerProgress,
  minutesToSeconds,
  shouldAutoStartNextMode
} from "./timerUtils";

describe("timerUtils", () => {
  it("formats and clamps timer values", () => {
    expect(formatSeconds(65)).toBe("01:05");
    expect(formatSeconds(-10)).toBe("00:00");
    expect(minutesToSeconds(0)).toBe(60);
    expect(minutesToSeconds(130)).toBe(120 * 60);
  });

  it("calculates progress in a bounded range", () => {
    expect(getTimerProgress(30, 60)).toBe(0.5);
    expect(getTimerProgress(-10, 60)).toBe(1);
    expect(getTimerProgress(80, 60)).toBe(0);
    expect(getTimerProgress(10, 0)).toBe(0);
  });

  it("selects break modes and auto-start behavior", () => {
    expect(getNextTimerMode("work", 1)).toBe("shortBreak");
    expect(getNextTimerMode("work", 4)).toBe("longBreak");
    expect(getNextTimerMode("shortBreak", 4)).toBe("work");
    expect(shouldAutoStartNextMode("manual", "shortBreak")).toBe(false);
    expect(shouldAutoStartNextMode("breaks", "shortBreak")).toBe(true);
    expect(shouldAutoStartNextMode("breaks", "work")).toBe(false);
    expect(shouldAutoStartNextMode("all", "work")).toBe(true);
  });
});
