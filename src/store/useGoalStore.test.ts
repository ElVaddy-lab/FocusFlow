import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_DAILY_FOCUS_GOAL } from "../utils/goalUtils";
import { useGoalStore } from "./useGoalStore";

describe("useGoalStore", () => {
  beforeEach(() => {
    useGoalStore.setState(DEFAULT_DAILY_FOCUS_GOAL);
  });

  it("updates the full daily goal", () => {
    useGoalStore.getState().setGoal({
      mode: "pomodoros",
      targetMinutes: 45,
      targetPomodoros: 3
    });

    expect(useGoalStore.getState()).toMatchObject({
      mode: "pomodoros",
      targetMinutes: 45,
      targetPomodoros: 3
    });
  });

  it("updates only the goal mode", () => {
    useGoalStore.getState().setGoalMode("pomodoros");

    expect(useGoalStore.getState()).toMatchObject({
      mode: "pomodoros",
      targetMinutes: DEFAULT_DAILY_FOCUS_GOAL.targetMinutes,
      targetPomodoros: DEFAULT_DAILY_FOCUS_GOAL.targetPomodoros
    });
  });
});
