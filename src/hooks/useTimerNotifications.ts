import { useEffect, useRef } from "react";

import { useTaskStore } from "../store/useTaskStore";
import { useTimerStore } from "../store/useTimerStore";
import { useTranslation } from "./useTranslation";

function formatNotificationTemplate(
  template: string,
  replacements: Record<string, string>
): string {
  return Object.entries(replacements).reduce(
    (message, [key, value]) => replaceToken(message, key, value),
    template
  );
}

export function useTimerNotifications() {
  const lastCompletedTimerEvent = useTimerStore(
    (state) => state.lastCompletedTimerEvent
  );
  const tasks = useTaskStore((state) => state.tasks);
  const { t } = useTranslation();
  const notifiedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !lastCompletedTimerEvent ||
      notifiedEventIdRef.current === lastCompletedTimerEvent.id
    ) {
      return;
    }

    notifiedEventIdRef.current = lastCompletedTimerEvent.id;

    const task = tasks.find(
      (item) => item.id === lastCompletedTimerEvent.taskId
    );
    const nextMode = t.timer.modes[lastCompletedTimerEvent.nextMode].label;
    const isWorkSession = lastCompletedTimerEvent.mode === "work";
    const title = isWorkSession
      ? t.notifications.focusTitle
      : t.notifications.breakTitle;
    const body = getNotificationBody({
      isWorkSession,
      nextMode,
      taskTitle: task?.title,
      translations: t.notifications
    });

    void window.focusFlow?.notify({ body, title });
  }, [lastCompletedTimerEvent, t, tasks]);
}

function replaceToken(message: string, key: string, value: string): string {
  return message.split(`{${key}}`).join(value);
}

function getNotificationBody({
  isWorkSession,
  nextMode,
  taskTitle,
  translations
}: {
  isWorkSession: boolean;
  nextMode: string;
  taskTitle?: string;
  translations: {
    breakComplete: string;
    workComplete: string;
    workCompleteWithTask: string;
  };
}): string {
  if (!isWorkSession) {
    return formatNotificationTemplate(translations.breakComplete, {
      nextMode
    });
  }

  if (taskTitle) {
    return formatNotificationTemplate(translations.workCompleteWithTask, {
      nextMode,
      taskTitle
    });
  }

  return formatNotificationTemplate(translations.workComplete, {
    nextMode
  });
}
