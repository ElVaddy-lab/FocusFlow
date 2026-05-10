import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  Notification,
  shell,
  Tray
} from "electron";
import fs from "node:fs/promises";
import path from "node:path";

app.setName("FocusFlow");

if (process.platform === "win32" && process.env.APPDATA) {
  app.setPath("userData", path.join(process.env.APPDATA, "FocusFlow"));
}

const devServerUrl = process.env.VITE_DEV_SERVER_URL;
const appIconPath = path.join(__dirname, "../build/icon.ico");
const persistedStateFileName = "focusflow-state.json";
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
type PersistedState = Record<string, string>;

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
    if (!isNotificationPayload(payload) || !Notification.isSupported()) {
      return;
    }

    new Notification({
      body: payload.body,
      icon: appIconPath,
      title: payload.title
    }).show();
  });
}

function getPersistedStatePath(): string {
  return path.join(app.getPath("userData"), persistedStateFileName);
}

async function readPersistedState(): Promise<PersistedState> {
  try {
    const content = await fs.readFile(getPersistedStatePath(), "utf8");
    const parsed = JSON.parse(content) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.entries(parsed).reduce<PersistedState>(
      (state, [key, value]) => {
        if (typeof value === "string") {
          state[key] = value;
        }

        return state;
      },
      {}
    );
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return {};
    }

    console.error("Failed to read FocusFlow state.", error);
    return {};
  }
}

async function writePersistedState(state: PersistedState): Promise<void> {
  const filePath = getPersistedStatePath();

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(state, null, 2), "utf8");
}

function isStorageKey(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function registerPersistentStorageHandlers(): void {
  ipcMain.handle("focusflow:storage-get", async (_event, key: unknown) => {
    if (!isStorageKey(key)) {
      return null;
    }

    const state = await readPersistedState();

    return state[key] ?? null;
  });

  ipcMain.handle(
    "focusflow:storage-set",
    async (_event, key: unknown, value: unknown) => {
      if (!isStorageKey(key) || typeof value !== "string") {
        return;
      }

      const state = await readPersistedState();
      state[key] = value;
      await writePersistedState(state);
    }
  );

  ipcMain.handle("focusflow:storage-remove", async (_event, key: unknown) => {
    if (!isStorageKey(key)) {
      return;
    }

    const state = await readPersistedState();
    delete state[key];
    await writePersistedState(state);
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
    void window.loadURL(url);
    return;
  }

  if (view === "mini") {
    void window.loadFile(path.join(__dirname, "../dist/index.html"), {
      query: { view }
    });
    return;
  }

  void window.loadFile(path.join(__dirname, "../dist/index.html"));
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
  if (command === "showMain") {
    showMainWindow();
    return;
  }

  mainWindow?.webContents.send("focusflow:timer-command", command);
}

function updateTrayMenu(): void {
  if (!tray) {
    return;
  }

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

  tray = new Tray(trayIcon);
  tray.on("double-click", showMainWindow);
  updateTrayMenu();
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
    createMiniWindow();
  });

  ipcMain.handle("focusflow:show-main-window", () => {
    showMainWindow();
  });

  ipcMain.handle("focusflow:timer-command", (_event, command: unknown) => {
    if (isTimerCommand(command)) {
      sendTimerCommand(command);
    }
  });

  ipcMain.on("focusflow:timer-snapshot", (_event, payload: unknown) => {
    if (!isTimerSnapshot(payload)) {
      return;
    }

    lastTimerSnapshot = payload;
    miniWindow?.webContents.send("focusflow:timer-snapshot", payload);
    updateTrayMenu();
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
  registerTimerBridge();
  createMainWindow();
  createTray();

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
});

app.on("window-all-closed", () => {
  if (isQuitting && process.platform !== "darwin") {
    app.quit();
  }
});
