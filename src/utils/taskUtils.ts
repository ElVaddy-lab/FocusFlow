import type { Task } from "../types";

export type TodayMoveDirection = "up" | "down";

export function getTodayTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => task.isToday && task.status !== "completed")
    .sort((first, second) => first.todayOrder - second.todayOrder);
}

export function getNextTodayOrder(tasks: Task[]): number {
  const todayOrders = tasks
    .filter((task) => task.isToday)
    .map((task) => task.todayOrder);

  if (todayOrders.length === 0) {
    return 0;
  }

  return Math.max(...todayOrders) + 1;
}

export function getFirstTodayOrder(tasks: Task[]): number {
  const todayOrders = tasks
    .filter((task) => task.isToday)
    .map((task) => task.todayOrder);

  if (todayOrders.length === 0) {
    return 0;
  }

  return Math.min(...todayOrders) - 1;
}

export function sortTasksForFocusSelect(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => task.status !== "completed")
    .sort((first, second) => {
      if (first.isToday !== second.isToday) {
        return first.isToday ? -1 : 1;
      }

      if (first.isToday && second.isToday) {
        return first.todayOrder - second.todayOrder;
      }

      return 0;
    });
}
