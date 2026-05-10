interface FocusFlowNotificationPayload {
  body: string;
  title: string;
}

type FocusFlowTimerCommand = "pause" | "reset" | "showMain" | "start";

interface FocusFlowTimerSnapshot {
  activeTaskTitle: string | null;
  formattedTime: string;
  mode: string;
  remainingSeconds: number;
  status: string;
}

interface Window {
  focusFlow?: {
    getPersistedValue: (key: string) => Promise<string | null>;
    notify: (payload: FocusFlowNotificationPayload) => Promise<void>;
    onTimerCommand: (
      callback: (command: FocusFlowTimerCommand) => void
    ) => () => void;
    onTimerSnapshot: (
      callback: (snapshot: FocusFlowTimerSnapshot) => void
    ) => () => void;
    openMiniTimer: () => Promise<void>;
    platform: string;
    publishTimerSnapshot: (snapshot: FocusFlowTimerSnapshot) => void;
    removePersistedValue: (key: string) => Promise<void>;
    sendTimerCommand: (command: FocusFlowTimerCommand) => Promise<void>;
    setPersistedValue: (key: string, value: string) => Promise<void>;
    showMainWindow: () => Promise<void>;
  };
}
