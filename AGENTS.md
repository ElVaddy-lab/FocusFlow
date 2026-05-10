# AGENTS.md

## Project

FocusFlow is an Electron desktop app for task planning, Pomodoro focus sessions, Strict Mode, statistics, streaks, and English/Ukrainian localization.

The user-facing app is implemented in React + TypeScript. State is handled through Zustand stores persisted to LocalStorage. The Windows app is packaged with Electron Builder.

## Commands

Use `npm.cmd` on Windows PowerShell.

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run dist:win
```

`npm.cmd run build` is the minimum validation before completing code changes.

## Important Paths

```text
electron/main.ts
electron/preload.ts
src/App.tsx
src/components/layout/
src/components/settings/
src/components/stats/
src/components/tasks/
src/components/timer/
src/hooks/
src/i18n/translations.ts
src/store/
src/types/index.ts
src/utils/
build/icon.png
build/icon.ico
```

Generated output:

```text
dist/
dist-electron/
release/
node_modules/
```

Do not commit generated output.

## Architecture Rules

- Keep UI components small and grouped by feature.
- Put shared domain types in `src/types/index.ts`.
- Put reusable helpers in `src/utils/`.
- Put persisted state in `src/store/` using Zustand.
- Keep app text in `src/i18n/translations.ts`; do not hardcode visible UI strings in components unless the text is user data or an external literal.
- Keep theme and language persisted separately from domain data.
- Do not introduce a router until navigation needs URLs or deep links.
- Do not automatically modify the Windows hosts file. Strict Mode may generate a script, but user execution must remain explicit.

## State Stores

- `useThemeStore`: light/dark theme.
- `useLanguageStore`: English/Ukrainian language.
- `useTaskStore`: tasks and CRUD behavior.
- `useTimerStore`: Pomodoro mode, durations, active task, countdown, completion event.
- `useStrictModeStore`: Strict Mode toggle, blocked sites, lockout attempts.
- `useStatsStore`: completed Pomodoro session history.

## Timer And Stats

Completed work sessions are emitted from `useTimerStore.lastCompletedPomodoro`.
`usePomodoroSessionRecorder` listens for that event and writes one persisted session to `useStatsStore`.

Avoid recording stats directly from UI button handlers. The timer store should remain the source of truth for completed Pomodoros.

## Localization

Supported languages:

- `en`
- `uk`

When adding UI:

1. Add copy to both language objects in `src/i18n/translations.ts`.
2. Read copy through `useTranslation()`.
3. Keep labels short enough to fit responsive layouts.

## Styling

- Use Tailwind CSS.
- Keep cards at `rounded-md` or similarly restrained radii.
- Avoid nested cards.
- Preserve dark-mode classes when adding UI.
- Use Lucide icons for icon buttons where possible.

## Packaging

The Windows icon source is:

```text
build/icon.png
build/icon.ico
```

The Electron Builder configuration lives in `package.json`.

`win.signAndEditExecutable` is currently set to `false` because `winCodeSign` extraction can fail in this Windows environment when symlink privileges are unavailable.

The portable executable is generated at:

```text
release/FocusFlow-0.1.0-portable.exe
```

## Git Safety

- The workspace may not be initialized as a git repository.
- Never commit `node_modules/`, `dist/`, `dist-electron/`, or `release/`.
- Stage explicit paths when the worktree contains mixed or unrelated changes.
- Run `npm.cmd run build` before committing code changes.
- If asked to push to GitHub, first verify `gh --version`, `gh auth status`, `git status --short --branch`, and `git remote -v`.
