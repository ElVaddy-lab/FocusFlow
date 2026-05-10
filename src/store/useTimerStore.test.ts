import { beforeEach, describe, expect, it } from "vitest";

import { useStatsStore } from "./useStatsStore";
import { useTimerStore } from "./useTimerStore";

describe("useTimerStore", () => {
  beforeEach(() => {
    useTimerStore.setState({
      activeTaskId: null,
      autoStartMode: "manual",
      completedWorkSessions: 0,
      durations: {
        longBreak: 900,
        shortBreak: 300,
        work: 1500
      },
      lastCompletedPomodoro: null,
      lastCompletedTimerEvent: null,
      mode: "work",
      remainingSeconds: 1500,
      status: "idle"
    });
    useStatsStore.setState({ sessions: [] });
  });

  it("completes work sessions and emits both timer and pomodoro events", () => {
    useTimerStore.setState({
      activeTaskId: "task-1",
      remainingSeconds: 1,
      status: "running"
    });

    useTimerStore.getState().tick();

    const state = useTimerStore.getState();

    expect(state.completedWorkSessions).toBe(1);
    expect(state.mode).toBe("shortBreak");
    expect(state.status).toBe("idle");
    expect(state.lastCompletedTimerEvent).toMatchObject({
      durationSeconds: 1500,
      mode: "work",
      nextMode: "shortBreak",
      taskId: "task-1"
    });
    expect(state.lastCompletedPomodoro).toMatchObject({
      durationSeconds: 1500,
      taskId: "task-1"
    });
  });

  it("auto-starts only allowed transitions", () => {
    useTimerStore.setState({
      autoStartMode: "breaks",
      remainingSeconds: 1,
      status: "running"
    });
    useTimerStore.getState().tick();

    expect(useTimerStore.getState().status).toBe("running");

    useTimerStore.setState({
      mode: "shortBreak",
      remainingSeconds: 1,
      status: "running"
    });
    useTimerStore.getState().tick();

    expect(useTimerStore.getState().mode).toBe("work");
    expect(useTimerStore.getState().status).toBe("idle");
  });

  it("prevents duplicate recorded stats sessions", () => {
    const session = {
      completedAt: "2026-05-08T12:00:00.000Z",
      durationSeconds: 1500,
      id: "session-1",
      taskId: null,
      taskTitle: null
    };

    useStatsStore.getState().recordPomodoroSession(session);
    useStatsStore.getState().recordPomodoroSession(session);

    expect(useStatsStore.getState().sessions).toHaveLength(1);
  });
});
