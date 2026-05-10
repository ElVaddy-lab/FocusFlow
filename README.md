# FocusFlow

FocusFlow is a desktop anti-procrastination app built with Electron, React, TypeScript, Tailwind CSS, Zustand, and Vite. It combines task planning, a Pomodoro timer, Strict Mode, local statistics, streaks, and English/Ukrainian UI language switching.

## Features

- Task Manager: create, edit, delete, complete, and persist tasks locally.
- Pomodoro Timer: work, short break, and long break modes with configurable durations.
- Task-linked focus sessions: select an active task for the timer.
- Strict Mode: prevent pausing/resetting active work sessions and manage a blocked-domain list.
- Windows hosts script generation for blocked domains.
- Statistics: completed Pomodoro history, weekly focus chart, current streak, and best streak.
- Appearance: light/dark theme.
- Languages: English and Ukrainian.
- Windows packaging: portable `.exe` build with a custom app icon.

## Tech Stack

- Electron 39
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand with LocalStorage persistence
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

## Build Windows EXE

```powershell
npm.cmd run dist:win
```

The portable executable is generated at:

```text
release/FocusFlow-0.1.0-portable.exe
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
  hooks/                  App hooks for timer, blocker, stats recording, i18n
  i18n/                   English/Ukrainian translations
  store/                  Zustand stores
  types/                  Shared TypeScript types
  utils/                  Validation, timer, blocker, and stats helpers
build/
  icon.png                Source app icon
  icon.ico                Windows app icon
```

## Local Persistence

The app stores user data in LocalStorage through Zustand persist middleware:

- `focusflow-theme`
- `focusflow-language`
- `focusflow-tasks`
- `focusflow-timer`
- `focusflow-strict-mode`
- `focusflow-stats`

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
npm.cmd run dist:win        Build a Windows portable exe
```

## GitHub Publishing

This workspace was not initialized as a git repository when the app was created. To push it to GitHub, initialize git, commit the source files, create or add a GitHub remote, and push the branch. Do not commit generated directories such as `node_modules/`, `dist/`, `dist-electron/`, or `release/`.
