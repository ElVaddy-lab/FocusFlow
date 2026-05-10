import { contextBridge, ipcRenderer } from "electron";

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

const focusFlowApi = {
  notify: (payload: NotificationPayload) =>
    ipcRenderer.invoke("focusflow:notify", payload),
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
  openMiniTimer: () => ipcRenderer.invoke("focusflow:open-mini-timer"),
  platform: process.platform,
  publishTimerSnapshot: (snapshot: TimerSnapshot) =>
    ipcRenderer.send("focusflow:timer-snapshot", snapshot),
  sendTimerCommand: (command: TimerCommand) =>
    ipcRenderer.invoke("focusflow:timer-command", command),
  showMainWindow: () => ipcRenderer.invoke("focusflow:show-main-window")
};

contextBridge.exposeInMainWorld("focusFlow", focusFlowApi);

export type FocusFlowApi = typeof focusFlowApi;
