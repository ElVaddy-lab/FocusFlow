import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  Notification,
  shell,
  Tray
} from "electron";
import fs from "node:fs/promises";
import path from "node:path";

import { configureLogger, logError, logInfo, logWarn } from "./logger";
import { IpcRateLimiter } from "./ipcRateLimit";
import {
  isPersistedStoreKey,
  parseBackupFile,
  type BackupResult,
  type FocusFlowBackupFile
} from "./persistedState";
import { PersistedStateStorage } from "./persistedStateStorage";

app.setName("FocusFlow");

if (process.platform === "win32" && process.env.APPDATA) {
  app.setPath("userData", path.join(process.env.APPDATA, "FocusFlow"));
}

configureLogger(app.getPath("userData"));

const devServerUrl = process.env.VITE_DEV_SERVER_URL;
const appIconPath = path.join(__dirname, "../build/icon.ico");
const persistedStateStorage = new PersistedStateStorage(app.getPath("userData"));
const notificationRateLimiter = new IpcRateLimiter({
  maxRequests: 5,
  windowMs: 60_000
});
const rendererErrorRateLimiter = new IpcRateLimiter({
  maxRequests: 10,
  windowMs: 60_000
});
const storageGetRateLimiter = new IpcRateLimiter({
  maxRequests: 240,
  windowMs: 60_000
});
const storageMutationRateLimiter = new IpcRateLimiter({
  maxRequests: 120,
  windowMs: 60_000
});
const timerSnapshotRateLimiter = new IpcRateLimiter({
  maxRequests: 4,
  windowMs: 1_000
});
let isQuitting = false;
let mainWindow: BrowserWindow | null = null;
let miniWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

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

let lastTimerSnapshot: TimerSnapshot = {
  activeTaskTitle: null,
  formattedTime: "00:00",
  mode: "work",
  remainingSeconds: 0,
  status: "idle"
};

function isNotificationPayload(
  payload: unknown
): payload is NotificationPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<NotificationPayload>;

  return (
    typeof candidate.body === "string" &&
    typeof candidate.title === "string" &&
    candidate.body.trim().length > 0 &&
    candidate.title.trim().length > 0
  );
}

function registerNotificationHandler(): void {
  ipcMain.handle("focusflow:notify", (_event, payload: unknown) => {
    try {
      if (!notificationRateLimiter.allow("focusflow:notify")) {
        return;
      }

      if (!isNotificationPayload(payload) || !Notification.isSupported()) {
        return;
      }

      new Notification({
        body: payload.body,
        icon: appIconPath,
        title: payload.title
      }).show();
    } catch (error) {
      logError("Failed to show notification.", error);
    }
  });
}

function isRendererErrorReport(value: unknown): value is RendererErrorReport {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<RendererErrorReport>;

  return typeof candidate.message === "string" && candidate.message.length > 0;
}

function registerPersistentStorageHandlers(): void {
  ipcMain.handle("focusflow:storage-get", async (_event, key: unknown) => {
    try {
      if (!storageGetRateLimiter.allow("focusflow:storage-get")) {
        return null;
      }

      if (!isPersistedStoreKey(key)) {
        logWarn("Rejected storage get for unknown key.", { key });
        return null;
      }

      const state = await persistedStateStorage.readState();

      return state.stores[key] ?? null;
    } catch (error) {
      logError("Storage get failed.", error);
      return null;
    }
  });

  ipcMain.handle(
    "focusflow:storage-set",
    async (_event, key: unknown, value: unknown) => {
      try {
        if (!storageMutationRateLimiter.allow("focusflow:storage-set")) {
          return;
        }

        if (!isPersistedStoreKey(key) || typeof value !== "string") {
          logWarn("Rejected storage set for invalid payload.", { key });
          return;
        }

        await persistedStateStorage.setStoreValue(key, value);
      } catch (error) {
        logError("Storage set failed.", error);
      }
    }
  );

  ipcMain.handle("focusflow:storage-remove", async (_event, key: unknown) => {
    try {
      if (!storageMutationRateLimiter.allow("focusflow:storage-remove")) {
        return;
      }

      if (!isPersistedStoreKey(key)) {
        logWarn("Rejected storage remove for unknown key.", { key });
        return;
      }

      await persistedStateStorage.removeStoreValue(key);
    } catch (error) {
      logError("Storage remove failed.", error);
    }
  });

  ipcMain.handle("focusflow:renderer-error", (_event, payload: unknown) => {
    if (!rendererErrorRateLimiter.allow("focusflow:renderer-error")) {
      return;
    }

    if (!isRendererErrorReport(payload)) {
      return;
    }

    logError("Renderer reported an error.", payload);
  });
}

async function exportBackup(): Promise<BackupResult> {
  try {
    const state = await persistedStateStorage.readState();
    const defaultPath = path.join(
      app.getPath("documents"),
      `FocusFlow-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    const result = await dialog.showSaveDialog({
      defaultPath,
      filters: [{ extensions: ["json"], name: "FocusFlow backup" }],
      title: "Export FocusFlow backup"
    });

    if (result.canceled || !result.filePath) {
      return { message: "Export canceled.", success: false };
    }

    const backup: FocusFlowBackupFile = {
      appVersion: app.getVersion(),
      exportedAt: new Date().toISOString(),
      state
    };

    await fs.writeFile(result.filePath, JSON.stringify(backup, null, 2), "utf8");
    logInfo("Exported FocusFlow backup.", { path: result.filePath });

    return {
      message: "Backup exported.",
      path: result.filePath,
      success: true
    };
  } catch (error) {
    logError("Failed to export backup.", error);
    return { message: "Backup export failed.", success: false };
  }
}

async function importBackup(): Promise<BackupResult> {
  try {
    const result = await dialog.showOpenDialog({
      filters: [{ extensions: ["json"], name: "FocusFlow backup" }],
      properties: ["openFile"],
      title: "Import FocusFlow backup"
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { message: "Import canceled.", success: false };
    }

    const filePath = result.filePaths[0];
    const backup = parseBackupFile(await fs.readFile(filePath, "utf8"));

    if (!backup) {
      return { message: "Invalid backup file.", success: false };
    }

    await persistedStateStorage.replaceStateFromBackup(backup.state);
    logInfo("Imported FocusFlow backup.", { path: filePath });

    return {
      importedStores: Object.keys(backup.state.stores).length,
      message: "Backup imported. Restart FocusFlow to reload restored data.",
      path: filePath,
      success: true
    };
  } catch (error) {
    logError("Failed to import backup.", error);
    return { message: "Backup import failed.", success: false };
  }
}

function registerBackupHandlers(): void {
  ipcMain.handle("focusflow:backup-export", exportBackup);
  ipcMain.handle("focusflow:backup-import", importBackup);
  ipcMain.handle("focusflow:backup-metadata", async () => {
    try {
      const state = await persistedStateStorage.readState();

      return {
        path: persistedStateStorage.getStatePath(),
        schemaVersion: state.schemaVersion,
        stores: Object.keys(state.stores),
        updatedAt: state.updatedAt
      };
    } catch (error) {
      logError("Failed to read backup metadata.", error);
      return null;
    }
  });
}

function isTimerSnapshot(payload: unknown): payload is TimerSnapshot {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<TimerSnapshot>;

  return (
    (typeof candidate.activeTaskTitle === "string" ||
      candidate.activeTaskTitle === null) &&
    typeof candidate.formattedTime === "string" &&
    typeof candidate.mode === "string" &&
    typeof candidate.remainingSeconds === "number" &&
    typeof candidate.status === "string"
  );
}

function isTimerCommand(payload: unknown): payload is TimerCommand {
  return (
    payload === "pause" ||
    payload === "reset" ||
    payload === "showMain" ||
    payload === "start"
  );
}

function loadWindow(window: BrowserWindow, view?: "mini"): void {
  if (devServerUrl) {
    const url = view === "mini" ? `${devServerUrl}?view=mini` : devServerUrl;
    void window.loadURL(url).catch((error) => {
      logError("Failed to load development window.", { error, view });
    });
    return;
  }

  if (view === "mini") {
    void window
      .loadFile(path.join(__dirname, "../dist/index.html"), {
        query: { view }
      })
      .catch((error) => {
        logError("Failed to load mini window.", error);
      });
    return;
  }

  void window.loadFile(path.join(__dirname, "../dist/index.html")).catch((error) => {
    logError("Failed to load main window.", error);
  });
}

function showMainWindow(): void {
  if (!mainWindow) {
    createMainWindow();
    return;
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
}

function sendTimerCommand(command: TimerCommand): void {
  try {
    if (command === "showMain") {
      showMainWindow();
      return;
    }

    mainWindow?.webContents.send("focusflow:timer-command", command);
  } catch (error) {
    logError("Failed to send timer command.", { command, error });
  }
}

function registerGlobalShortcuts(): void {
  const shortcuts: Array<[string, () => void]> = [
    [
      "Control+Alt+S",
      () =>
        sendTimerCommand(
          lastTimerSnapshot.status === "running" ? "pause" : "start"
        )
    ],
    ["Control+Alt+R", () => sendTimerCommand("reset")],
    ["Control+Alt+M", createMiniWindow],
    ["Control+Alt+T", showMainWindow]
  ];

  for (const [accelerator, handler] of shortcuts) {
    try {
      const registered = globalShortcut.register(accelerator, handler);

      if (!registered) {
        logWarn("Failed to register global shortcut.", { accelerator });
      }
    } catch (error) {
      logError(`Global shortcut registration failed: ${accelerator}`, error);
    }
  }
}

function updateTrayMenu(): void {
  if (!tray) {
    return;
  }

  try {
    const isRunning = lastTimerSnapshot.status === "running";
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Open FocusFlow",
        click: showMainWindow
      },
      {
        label: "Mini Timer",
        click: createMiniWindow
      },
      { type: "separator" },
      {
        label: isRunning ? "Pause" : "Start",
        click: () => sendTimerCommand(isRunning ? "pause" : "start")
      },
      {
        label: "Reset",
        click: () => sendTimerCommand("reset")
      },
      { type: "separator" },
      {
        label: "Quit FocusFlow",
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip(`FocusFlow - ${lastTimerSnapshot.formattedTime}`);
  } catch (error) {
    logError("Failed to update tray menu.", error);
  }
}

function createTray(): void {
  if (tray) {
    updateTrayMenu();
    return;
  }

  const trayIcon = nativeImage.createFromPath(appIconPath).resize({
    height: 16,
    width: 16
  });

  try {
    tray = new Tray(trayIcon);
    tray.on("double-click", showMainWindow);
    updateTrayMenu();
  } catch (error) {
    logError("Failed to create tray.", error);
  }
}

function createMiniWindow(): void {
  if (miniWindow) {
    miniWindow.show();
    miniWindow.focus();
    miniWindow.webContents.send("focusflow:timer-snapshot", lastTimerSnapshot);
    return;
  }

  miniWindow = new BrowserWindow({
    width: 320,
    height: 220,
    minWidth: 300,
    minHeight: 200,
    title: "FocusFlow Mini Timer",
    icon: appIconPath,
    alwaysOnTop: true,
    resizable: false,
    backgroundColor: "#09090b",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  miniWindow.on("closed", () => {
    miniWindow = null;
  });

  miniWindow.webContents.on("did-finish-load", () => {
    miniWindow?.webContents.send("focusflow:timer-snapshot", lastTimerSnapshot);
  });

  loadWindow(miniWindow, "mini");
}

function registerTimerBridge(): void {
  ipcMain.handle("focusflow:open-mini-timer", () => {
    try {
      createMiniWindow();
    } catch (error) {
      logError("Failed to open mini timer.", error);
    }
  });

  ipcMain.handle("focusflow:show-main-window", () => {
    try {
      showMainWindow();
    } catch (error) {
      logError("Failed to show main window.", error);
    }
  });

  ipcMain.handle("focusflow:timer-command", (_event, command: unknown) => {
    try {
      if (isTimerCommand(command)) {
        sendTimerCommand(command);
      }
    } catch (error) {
      logError("Timer command IPC failed.", error);
    }
  });

  ipcMain.on("focusflow:timer-snapshot", (_event, payload: unknown) => {
    try {
      if (!timerSnapshotRateLimiter.allow("focusflow:timer-snapshot")) {
        return;
      }

      if (!isTimerSnapshot(payload)) {
        return;
      }

      lastTimerSnapshot = payload;
      miniWindow?.webContents.send("focusflow:timer-snapshot", payload);
      updateTrayMenu();
    } catch (error) {
      logError("Timer snapshot IPC failed.", error);
    }
  });
}

function createMainWindow(): void {
  if (mainWindow) {
    showMainWindow();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 960,
    minHeight: 640,
    title: "FocusFlow",
    icon: appIconPath,
    backgroundColor: "#f8fafc",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("close", (event) => {
    if (isQuitting) {
      return;
    }

    event.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  loadWindow(mainWindow);
}

if (process.platform === "win32") {
  app.setAppUserModelId("com.focusflow.desktop");
}

app.whenReady().then(() => {
  registerNotificationHandler();
  registerPersistentStorageHandlers();
  registerBackupHandlers();
  registerTimerBridge();
  createMainWindow();
  createTray();
  registerGlobalShortcuts();

  app.on("activate", () => {
    if (!mainWindow) {
      createMainWindow();
      return;
    }

    showMainWindow();
  });
});

app.on("before-quit", () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (isQuitting && process.platform !== "darwin") {
    app.quit();
  }
});
