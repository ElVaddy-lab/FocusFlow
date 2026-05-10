import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Task, TaskInput, TaskStatus } from "../types";
import { createTaskId } from "../utils/createTaskId";
import {
  normalizeEstimatedPomodoros,
  normalizeTaskTitle
} from "../utils/taskValidation";

interface TaskState {
  tasks: Task[];
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskStatus: (id: string) => void;
  clearCompletedTasks: () => void;
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
            id: createTaskId(),
            title,
            status: "todo",
            estimatedPomodoros: normalizeEstimatedPomodoros(
              input.estimatedPomodoros
            )
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
                    title,
                    estimatedPomodoros: normalizeEstimatedPomodoros(
                      input.estimatedPomodoros
                    )
                  }
                : task
            )
          };
        }),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      setTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
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
      name: "focusflow-tasks",
      partialize: (state) => ({ tasks: state.tasks })
    }
  )
);
