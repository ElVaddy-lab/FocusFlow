import { beforeEach, describe, expect, it } from "vitest";

import { migratePersistedStoreState } from "../utils/persistedStoreMigrations";
import { useTaskStore } from "./useTaskStore";

describe("useTaskStore", () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  it("creates normalized today tasks by default", () => {
    useTaskStore.getState().addTask({
      estimatedPomodoros: 2.6,
      notes: "  context  ",
      priority: "high",
      title: "  Write   tests  "
    });

    const task = useTaskStore.getState().tasks[0];

    expect(task).toMatchObject({
      estimatedPomodoros: 3,
      isToday: true,
      notes: "context",
      priority: "high",
      status: "todo",
      title: "Write tests"
    });
  });

  it("updates priority, today membership, order, and status", () => {
    useTaskStore.getState().addTask({
      estimatedPomodoros: 1,
      notes: "",
      priority: "medium",
      title: "First"
    });
    useTaskStore.getState().addTask({
      estimatedPomodoros: 1,
      notes: "",
      priority: "medium",
      title: "Second"
    });

    const [second, first] = useTaskStore.getState().tasks;

    useTaskStore.getState().setTaskPriority(first.id, "low");
    useTaskStore.getState().moveTodayTask(first.id, "up");
    useTaskStore.getState().toggleTaskToday(second.id);
    useTaskStore.getState().toggleTaskStatus(first.id);

    const tasks = useTaskStore.getState().tasks;
    const updatedFirst = tasks.find((task) => task.id === first.id);
    const updatedSecond = tasks.find((task) => task.id === second.id);

    expect(updatedFirst?.priority).toBe("low");
    expect(updatedFirst?.status).toBe("completed");
    expect(updatedSecond?.isToday).toBe(false);
    expect(updatedFirst?.todayOrder).toBeLessThan(
      updatedSecond?.todayOrder ?? Number.POSITIVE_INFINITY
    );
  });

  it("sanitizes legacy persisted tasks during migration", () => {
    const migrated = migratePersistedStoreState("focusflow-tasks", {
      tasks: [
        {
          estimatedPomodoros: 99,
          id: "",
          priority: "urgent",
          status: "unknown",
          title: "  Legacy task  "
        }
      ]
    }) as { tasks: Array<Record<string, unknown>> };

    expect(migrated.tasks[0]).toMatchObject({
      estimatedPomodoros: 12,
      isToday: false,
      notes: "",
      priority: "medium",
      status: "todo",
      title: "Legacy task",
      todayOrder: 0
    });
  });
});
