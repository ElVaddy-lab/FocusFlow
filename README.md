# FocusFlow

FocusFlow is a desktop anti-procrastination app built with Electron, React, TypeScript, Tailwind CSS, Zustand, and Vite. It combines task planning, a Pomodoro timer, Strict Mode, daily goals, local statistics, tray controls, and English/Ukrainian UI language switching.

## Features

- Task Manager: create, edit, delete, complete, prioritize, add notes, and persist tasks locally.
- Task Search and Filters: filter tasks by title/notes, priority, status, and Today membership.
- Today Queue: plan today's active focus queue and reorder it with up/down controls.
- Pomodoro Timer: work, short break, and long break modes with configurable durations and auto-start modes.
- Task-linked focus sessions: select an active task for the timer.
- Daily Focus Goal: track daily progress in minutes or Pomodoros.
- Strict Mode: prevent pausing/resetting active work sessions and manage a blocked-domain list.
- Windows hosts script generation for blocked domains.
- Statistics: completed Pomodoro history, weekly focus chart, 12-week heatmap, current streak, and best streak.
- System notifications when timer sessions complete.
- Audio notifications with a persisted enable toggle and volume control.
- Keyboard shortcuts for timer control, Mini Timer, main window restore, and edit cancellation.
- Local JSON backup and restore from Settings.
- Tray mode with Start/Pause/Reset actions and a Mini Timer window.
- Appearance: light/dark theme.
- Languages: English and Ukrainian.
- Windows packaging: portable `.exe` and installer builds with a custom app icon.

## Tech Stack

- Electron 39
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand with Electron-backed persistence and LocalStorage fallback
- Framer Motion
- Lucide React
- Electron Builder

## Requirements

- Node.js 24 or newer is recommended.
- npm 11 or newer.
- Windows is the primary packaging target.

PowerShell may block `npm.ps1` depending on execution policy. Use `npm.cmd` commands on Windows.

## Install

```powershell
npm.cmd install
```

## Development

```powershell
npm.cmd run dev
```

This starts Vite on `http://127.0.0.1:5173` and launches the Electron shell.

## Build

```powershell
npm.cmd run build
```

This runs TypeScript checks, builds the Electron main/preload files, and builds the Vite renderer.

## Build Windows Portable EXE

```powershell
npm.cmd run dist:win
```

The portable executable is generated at:

```text
release/FocusFlow-0.1.1-portable.exe
```

## Build Windows Installer

```powershell
npm.cmd run dist:installer
```

The installer is generated at:

```text
release/FocusFlow-Setup-0.1.1.exe
```

`release/`, `dist/`, `dist-electron/`, and `node_modules/` are generated directories and are ignored by git.

## Project Structure

```text
electron/
  main.ts                 Electron main process
  preload.ts              Safe preload boundary
src/
  components/
    layout/               App shell, navigation, theme toggle
    settings/             Language and Strict Mode settings
    stats/                Productivity dashboard
    tasks/                Task manager UI
    timer/                Pomodoro timer UI
  hooks/                  App hooks for timer, blocker, stats recording, i18n, shortcuts, audio
  i18n/                   English/Ukrainian translations
  store/                  Zustand stores
  types/                  Shared TypeScript types
  utils/                  Validation, timer, blocker, and stats helpers
build/
  icon.png                Source app icon
  icon.ico                Windows app icon
```

## Local Persistence

The app stores user data through Zustand persist middleware. In the installed Electron app, data is written to a durable schema-versioned JSON file in Electron `userData`:

```text
%APPDATA%/FocusFlow/focusflow-state.json
```

In development/browser fallback, the same stores can still use `localStorage`. On first installed launch, existing renderer `localStorage` values are migrated into the Electron-backed store when possible. Older flat state files are migrated into the current envelope format, and recovery backups are written as `focusflow-state.backup-*.json` before destructive recovery.

- `focusflow-theme`
- `focusflow-language`
- `focusflow-tasks`
- `focusflow-timer`
- `focusflow-goal`
- `focusflow-strict-mode`
- `focusflow-stats`
- `focusflow-audio-settings`

The Settings screen can export/import a local JSON backup. Backup files contain the schema-versioned state envelope plus export metadata (`appVersion`, `exportedAt`). Imports are validated through the same store sanitizers and migrations used by normal app startup.

Electron diagnostics are written to:

```text
%APPDATA%/FocusFlow/logs/focusflow-YYYY-MM-DD.log
```

## Strict Mode Notes

Strict Mode currently enforces in-app behavior during active work sessions:

- Pause becomes locked.
- Reset records a lockout instead of interrupting the session.
- Timer mode, task selection, and duration settings are disabled while the strict work session is running.

The Settings screen can also generate a Windows hosts-file script for blocked domains. The app does not automatically edit the system hosts file.

## Scripts

```text
npm.cmd run dev             Start Vite and Electron in development
npm.cmd run build           Type-check and build the app
npm.cmd run build:electron  Build Electron main/preload only
npm.cmd run preview         Preview the Vite renderer
npm.cmd run test            Run Vitest in watch mode
npm.cmd run test:run        Run Vitest once
npm.cmd run dist:win        Build a Windows portable exe
npm.cmd run dist:installer  Build a Windows installer exe
```

## Packaging Notes

Windows executable resources must be edited before installer creation so the installed `FocusFlow.exe`, shortcuts, installer, and uninstaller use `build/icon.ico` instead of the default Electron icon. Built-in `win.signAndEditExecutable` is disabled in this local Windows environment because Electron Builder's bundled `app-builder rcedit` extracts a legacy `winCodeSign` archive that requires symlink privileges. The `scripts/after-pack.cjs` hook uses the local `rcedit.exe` vendor binary to embed the app icon and version metadata instead.

## Keyboard Shortcuts

```text
Ctrl+Alt+S  Start/Pause timer
Ctrl+Alt+R  Reset timer
Ctrl+Alt+M  Open Mini Timer
Ctrl+Alt+T  Show main window
Space       Start/Pause on the Timer page when not typing
Escape      Cancel task edit forms
```

## Test Coverage

Vitest covers persistence envelope migration, backup parsing, store sanitizers, timer/task/stat utilities, and critical Zustand store transitions. Run the full suite with:

```powershell
npm.cmd run test:run
```
