import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Task, TaskInput, TaskPriority, TaskStatus } from "../types";
import { createTaskId } from "../utils/createTaskId";
import { persistentStorage } from "../utils/persistentStorage";
import {
  getFirstTodayOrder,
  getNextTodayOrder,
  getTodayTasks,
  type TodayMoveDirection
} from "../utils/taskUtils";
import {
  normalizeEstimatedPomodoros,
  normalizeTaskNotes,
  normalizeTaskPriority,
  normalizeTaskTitle
} from "../utils/taskValidation";

interface TaskState {
  tasks: Task[];
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  deleteTask: (id: string) => void;
  moveTodayTask: (id: string, direction: TodayMoveDirection) => void;
  setTaskPriority: (id: string, priority: TaskPriority) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskToday: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  clearCompletedTasks: () => void;
}

function normalizeTask(task: Partial<Task>, index: number): Task {
  return {
    estimatedPomodoros: normalizeEstimatedPomodoros(
      Number(task.estimatedPomodoros)
    ),
    id: typeof task.id === "string" ? task.id : createTaskId(),
    isToday: task.isToday ?? false,
    notes: normalizeTaskNotes(task.notes ?? ""),
    priority: normalizeTaskPriority(task.priority),
    status: task.status === "completed" ? "completed" : "todo",
    title: normalizeTaskTitle(task.title ?? "") || "Untitled task",
    todayOrder:
      typeof task.todayOrder === "number" && Number.isFinite(task.todayOrder)
        ? task.todayOrder
        : index
  };
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (input) =>
        set((state) => {
          const title = normalizeTaskTitle(input.title);

          if (!title) {
            return state;
          }

          const task: Task = {
            estimatedPomodoros: normalizeEstimatedPomodoros(
              input.estimatedPomodoros
            ),
            id: createTaskId(),
            isToday: true,
            notes: normalizeTaskNotes(input.notes),
            priority: normalizeTaskPriority(input.priority),
            status: "todo",
            title,
            todayOrder: getFirstTodayOrder(state.tasks)
          };

          return { tasks: [task, ...state.tasks] };
        }),
      updateTask: (id, input) =>
        set((state) => {
          const title = normalizeTaskTitle(input.title);

          if (!title) {
            return state;
          }

          return {
            tasks: state.tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    estimatedPomodoros: normalizeEstimatedPomodoros(
                      input.estimatedPomodoros
                    ),
                    notes: normalizeTaskNotes(input.notes),
                    priority: normalizeTaskPriority(input.priority),
                    title
                  }
                : task
            )
          };
        }),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      moveTodayTask: (id, direction) =>
        set((state) => {
          const todayTasks = getTodayTasks(state.tasks);
          const currentIndex = todayTasks.findIndex((task) => task.id === id);

          if (currentIndex === -1) {
            return state;
          }

          const targetIndex =
            direction === "up" ? currentIndex - 1 : currentIndex + 1;

          if (targetIndex < 0 || targetIndex >= todayTasks.length) {
            return state;
          }

          const currentTask = todayTasks[currentIndex];
          const targetTask = todayTasks[targetIndex];

          return {
            tasks: state.tasks.map((task) => {
              if (task.id === currentTask.id) {
                return { ...task, todayOrder: targetTask.todayOrder };
              }

              if (task.id === targetTask.id) {
                return { ...task, todayOrder: currentTask.todayOrder };
              }

              return task;
            })
          };
        }),
      setTaskPriority: (id, priority) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, priority: normalizeTaskPriority(priority) }
              : task
          )
        })),
      setTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          )
        })),
      toggleTaskToday: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  isToday: !task.isToday,
                  todayOrder: task.isToday
                    ? task.todayOrder
                    : getNextTodayOrder(state.tasks)
                }
              : task
          )
        })),
      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === "completed" ? "todo" : "completed"
                }
              : task
          )
        })),
      clearCompletedTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== "completed")
        }))
    }),
    {
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TaskState> | undefined;
        const persistedTasks = Array.isArray(persisted?.tasks)
          ? persisted.tasks
          : null;

        return {
          ...currentState,
          tasks: persistedTasks
            ? persistedTasks.map((task, index) => normalizeTask(task, index))
            : currentState.tasks
        };
      },
      name: "focusflow-tasks",
      partialize: (state) => ({ tasks: state.tasks }),
      storage: createJSONStorage(() => persistentStorage)
    }
  )
);
