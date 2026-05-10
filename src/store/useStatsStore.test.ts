import { beforeEach, describe, expect, it } from "vitest";

import type { PomodoroSession } from "../types";
import { useStatsStore } from "./useStatsStore";

const session: PomodoroSession = {
  completedAt: "2026-05-08T12:00:00.000Z",
  durationSeconds: 1500,
  id: "session-1",
  taskId: "task-1",
  taskTitle: "Write tests"
};

describe("useStatsStore", () => {
  beforeEach(() => {
    useStatsStore.setState({ sessions: [] });
  });

  it("records new sessions at the front of the list", () => {
    useStatsStore.getState().recordPomodoroSession({
      ...session,
      id: "session-1"
    });
    useStatsStore.getState().recordPomodoroSession({
      ...session,
      id: "session-2"
    });

    expect(useStatsStore.getState().sessions.map((item) => item.id)).toEqual([
      "session-2",
      "session-1"
    ]);
  });

  it("deduplicates sessions by id", () => {
    useStatsStore.getState().recordPomodoroSession(session);
    useStatsStore.getState().recordPomodoroSession(session);

    expect(useStatsStore.getState().sessions).toHaveLength(1);
  });

  it("clears recorded sessions", () => {
    useStatsStore.getState().recordPomodoroSession(session);
    useStatsStore.getState().clearSessions();

    expect(useStatsStore.getState().sessions).toEqual([]);
  });
});
