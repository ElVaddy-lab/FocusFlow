import { useEffect } from "react";

import { useStatsStore } from "../store/useStatsStore";
import { useTaskStore } from "../store/useTaskStore";
import { useTimerStore } from "../store/useTimerStore";

export function usePomodoroSessionRecorder() {
  const lastCompletedPomodoro = useTimerStore(
    (state) => state.lastCompletedPomodoro
  );
  const tasks = useTaskStore((state) => state.tasks);
  const recordPomodoroSession = useStatsStore(
    (state) => state.recordPomodoroSession
  );

  useEffect(() => {
    if (!lastCompletedPomodoro) {
      return;
    }

    const task = tasks.find((item) => item.id === lastCompletedPomodoro.taskId);

    recordPomodoroSession({
      ...lastCompletedPomodoro,
      taskTitle: task?.title ?? null
    });
  }, [lastCompletedPomodoro, recordPomodoroSession, tasks]);
}
