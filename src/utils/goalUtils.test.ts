import { describe, expect, it } from "vitest";

import {
  getDailyGoalCurrent,
  getDailyGoalProgress,
  getDailyGoalTarget,
  isValidDailyGoalValue
} from "./goalUtils";

describe("goalUtils", () => {
  it("selects minutes target for minute goals", () => {
    expect(
      getDailyGoalTarget({
        mode: "minutes",
        targetMinutes: 90,
        targetPomodoros: 4
      })
    ).toBe(90);
  });

  it("selects pomodoro target for pomodoro goals", () => {
    expect(
      getDailyGoalTarget({
        mode: "pomodoros",
        targetMinutes: 90,
        targetPomodoros: 4
      })
    ).toBe(4);
  });

  it("selects current progress by goal mode", () => {
    expect(getDailyGoalCurrent("minutes", 75, 3)).toBe(75);
    expect(getDailyGoalCurrent("pomodoros", 75, 3)).toBe(3);
  });

  it("caps progress percent at 100 and clamps remaining to zero", () => {
    expect(
      getDailyGoalProgress(
        { mode: "minutes", targetMinutes: 60, targetPomodoros: 4 },
        90,
        2
      )
    ).toMatchObject({
      isComplete: true,
      percent: 100,
      remaining: 0
    });
  });

  it("calculates remaining progress before the goal is complete", () => {
    expect(
      getDailyGoalProgress(
        { mode: "pomodoros", targetMinutes: 60, targetPomodoros: 4 },
        50,
        2
      )
    ).toMatchObject({
      current: 2,
      isComplete: false,
      percent: 50,
      remaining: 2,
      target: 4
    });
  });

  it("validates minute goal ranges", () => {
    expect(isValidDailyGoalValue("minutes", 1)).toBe(true);
    expect(isValidDailyGoalValue("minutes", 1440)).toBe(true);
    expect(isValidDailyGoalValue("minutes", 0)).toBe(false);
    expect(isValidDailyGoalValue("minutes", 1441)).toBe(false);
  });

  it("validates pomodoro goal ranges and integer values", () => {
    expect(isValidDailyGoalValue("pomodoros", 48)).toBe(true);
    expect(isValidDailyGoalValue("pomodoros", 49)).toBe(false);
    expect(isValidDailyGoalValue("pomodoros", 2.5)).toBe(false);
  });
});
