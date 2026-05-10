import { contextBridge, ipcRenderer } from "electron";

import {
  invokeIpc,
  type IpcInvokeOptions,
  type IpcInvoker
} from "./ipcInvoke";

interface NotificationPayload {
  body: string;
  title: string;
}

interface TimerSnapshot {
  activeTaskTitle: string | null;
  formattedTime: string;
  mode: string;
  remainingSeconds: number;
  status: string;
}

type TimerCommand = "pause" | "reset" | "showMain" | "start";

interface RendererErrorReport {
  context?: string;
  message: string;
  stack?: string;
}

interface BackupResult {
  importedStores?: number;
  message: string;
  path?: string;
  success: boolean;
}

const invoke = ipcRenderer.invoke.bind(ipcRenderer) as IpcInvoker;

const storageInvokeOptions: IpcInvokeOptions = {
  retries: 2,
  retryDelayMs: 150,
  timeoutMs: 2500
};

const metadataInvokeOptions: IpcInvokeOptions = {
  retries: 1,
  retryDelayMs: 150,
  timeoutMs: 1500
};

const quickInvokeOptions: IpcInvokeOptions = {
  retries: 0,
  timeoutMs: 1500
};

function invokeStorage<T>(channel: string, ...args: unknown[]): Promise<T> {
  return invokeIpc<T>(invoke, channel, args, storageInvokeOptions);
}

function invokeQuick<T>(channel: string, ...args: unknown[]): Promise<T> {
  return invokeIpc<T>(invoke, channel, args, quickInvokeOptions);
}

const focusFlowApi = {
  exportBackup: () =>
    invokeIpc<BackupResult>(invoke, "focusflow:backup-export"),
  getBackupMetadata: () =>
    invokeIpc<unknown>(invoke, "focusflow:backup-metadata", [], metadataInvokeOptions),
  getPersistedValue: (key: string) =>
    invokeStorage<string | null>("focusflow:storage-get", key),
  importBackup: () =>
    invokeIpc<BackupResult>(invoke, "focusflow:backup-import"),
  notify: (payload: NotificationPayload) =>
    invokeQuick<void>("focusflow:notify", payload),
  onTimerCommand: (callback: (command: TimerCommand) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, command: TimerCommand) =>
      callback(command);

    ipcRenderer.on("focusflow:timer-command", listener);

    return () => ipcRenderer.removeListener("focusflow:timer-command", listener);
  },
  onTimerSnapshot: (callback: (snapshot: TimerSnapshot) => void) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      snapshot: TimerSnapshot
    ) => callback(snapshot);

    ipcRenderer.on("focusflow:timer-snapshot", listener);

    return () =>
      ipcRenderer.removeListener("focusflow:timer-snapshot", listener);
  },
  openMiniTimer: () => invokeQuick<void>("focusflow:open-mini-timer"),
  platform: process.platform,
  publishTimerSnapshot: (snapshot: TimerSnapshot) =>
    ipcRenderer.send("focusflow:timer-snapshot", snapshot),
  reportError: (payload: RendererErrorReport) =>
    invokeQuick<void>("focusflow:renderer-error", payload),
  removePersistedValue: (key: string) =>
    invokeStorage<void>("focusflow:storage-remove", key),
  sendTimerCommand: (command: TimerCommand) =>
    invokeQuick<void>("focusflow:timer-command", command),
  setPersistedValue: (key: string, value: string) =>
    invokeStorage<void>("focusflow:storage-set", key, value),
  showMainWindow: () => invokeQuick<void>("focusflow:show-main-window")
};

contextBridge.exposeInMainWorld("focusFlow", focusFlowApi);

export type FocusFlowApi = typeof focusFlowApi;
