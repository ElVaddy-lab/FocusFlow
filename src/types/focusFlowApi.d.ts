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

interface FocusFlowRendererErrorReport {
  context?: string;
  message: string;
  stack?: string;
}

interface FocusFlowBackupResult {
  importedStores?: number;
  message: string;
  path?: string;
  success: boolean;
}

interface Window {
  focusFlow?: {
    exportBackup: () => Promise<FocusFlowBackupResult>;
    getBackupMetadata: () => Promise<unknown>;
    getPersistedValue: (key: string) => Promise<string | null>;
    importBackup: () => Promise<FocusFlowBackupResult>;
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
    reportError: (payload: FocusFlowRendererErrorReport) => Promise<void>;
    removePersistedValue: (key: string) => Promise<void>;
    sendTimerCommand: (command: FocusFlowTimerCommand) => Promise<void>;
    setPersistedValue: (key: string, value: string) => Promise<void>;
    showMainWindow: () => Promise<void>;
  };
}
