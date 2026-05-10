import type { AppLanguage } from "../types";

export const translations = {
  en: {
    app: {
      title: "Desktop focus workspace"
    },
    nav: {
      dashboard: { label: "Dashboard", description: "Today at a glance" },
      timer: { label: "Timer", description: "Focus session" },
      settings: { label: "Settings", description: "Workspace preferences" }
    },
    pages: {
      dashboard: { eyebrow: "Dashboard", title: "Your focus overview" },
      timer: { eyebrow: "Timer", title: "Pomodoro session" },
      settings: { eyebrow: "Settings", title: "Workspace settings" }
    },
    common: {
      add: "Add",
      cancel: "Cancel",
      copied: "Copied.",
      copy: "Copy",
      delete: "Delete",
      edit: "Edit",
      failedClipboard: "Clipboard unavailable.",
      language: "Language",
      light: "Light",
      dark: "Dark",
      reset: "Reset",
      save: "Save",
      start: "Start",
      pause: "Pause"
    },
    dashboardCards: {
      completed: "Completed",
      tasks: "Tasks",
      timer: "Timer"
    },
    task: {
      active: "active",
      addTask: "Add task",
      clearCompleted: "Clear completed",
      completed: "completed",
      empty: "No tasks yet.",
      errorTitle: "Enter a task title.",
      fieldEstimate: "Pomodoros",
      fieldTitle: "Task",
      manager: "Task manager",
      placeholder: "Write the next concrete task",
      pomodoroSingular: "pomodoro",
      pomodoroPlural: "pomodoros",
      title: "Plan the next focus block",
      total: "total"
    },
    timer: {
      focusTask: "Focus task",
      locked: "Locked",
      noActiveTasks: "No active tasks",
      noFocusTask: "No focus task selected",
      noTaskSelected: "No task selected",
      session: "Session",
      sessionLengths: "Session lengths",
      status: {
        idle: "Idle",
        paused: "Paused",
        running: "Running"
      },
      strict: "Strict",
      modes: {
        work: { label: "Work", description: "Focused task time" },
        shortBreak: { label: "Short break", description: "Quick recovery" },
        longBreak: { label: "Long break", description: "Deeper reset" }
      }
    },
    settings: {
      appearance: "Appearance",
      blacklist: "Blacklist",
      blockedDomains: "Blocked domains",
      blockedSites: "Blocked sites",
      desktopBlocker: "Desktop blocker",
      domain: "Domain",
      domainError: "Enter a valid domain that is not already listed.",
      focusMode: "Focus mode",
      hostsEntries: "Hosts entries",
      languageTitle: "Interface language",
      lockouts: "Lockouts",
      off: "Off",
      on: "On",
      strictMode: "Strict Mode",
      theme: "Theme",
      toggleStrict: "Toggle Strict Mode",
      windowsHostsScript: "Windows hosts script"
    },
    stats: {
      bestStreak: "Best streak",
      completedPomodoros: "Completed Pomodoros",
      currentStreak: "Current streak",
      focusHistory: "Focus history",
      lastSevenDays: "Last 7 days",
      minutes: "minutes",
      noSessions: "No completed sessions yet.",
      productiveMinutes: "Productive minutes",
      recentSessions: "Recent sessions",
      sessions: "Sessions",
      statistics: "Statistics",
      today: "Today",
      untitled: "Untitled focus session"
    },
    units: {
      dayShort: "d",
      hourShort: "h",
      minuteShort: "m"
    }
  },
  uk: {
    app: {
      title: "Робочий простір для фокусу"
    },
    nav: {
      dashboard: { label: "Огляд", description: "Сьогодні одним поглядом" },
      timer: { label: "Таймер", description: "Фокус-сесія" },
      settings: { label: "Налаштування", description: "Параметри простору" }
    },
    pages: {
      dashboard: { eyebrow: "Огляд", title: "Твій фокус сьогодні" },
      timer: { eyebrow: "Таймер", title: "Pomodoro-сесія" },
      settings: { eyebrow: "Налаштування", title: "Параметри простору" }
    },
    common: {
      add: "Додати",
      cancel: "Скасувати",
      copied: "Скопійовано.",
      copy: "Копіювати",
      delete: "Видалити",
      edit: "Редагувати",
      failedClipboard: "Буфер обміну недоступний.",
      language: "Мова",
      light: "Світла",
      dark: "Темна",
      reset: "Скинути",
      save: "Зберегти",
      start: "Старт",
      pause: "Пауза"
    },
    dashboardCards: {
      completed: "Виконано",
      tasks: "Завдання",
      timer: "Таймер"
    },
    task: {
      active: "активні",
      addTask: "Додати завдання",
      clearCompleted: "Очистити виконані",
      completed: "виконані",
      empty: "Завдань поки немає.",
      errorTitle: "Введи назву завдання.",
      fieldEstimate: "Pomodoro",
      fieldTitle: "Завдання",
      manager: "Менеджер завдань",
      placeholder: "Запиши наступне конкретне завдання",
      pomodoroSingular: "pomodoro",
      pomodoroPlural: "pomodoro",
      title: "Заплануй наступний фокус-блок",
      total: "усього"
    },
    timer: {
      focusTask: "Завдання для фокусу",
      locked: "Заблоковано",
      noActiveTasks: "Немає активних завдань",
      noFocusTask: "Завдання не вибрано",
      noTaskSelected: "Без вибраного завдання",
      session: "Сесія",
      sessionLengths: "Тривалість сесій",
      status: {
        idle: "Готово",
        paused: "Пауза",
        running: "Запущено"
      },
      strict: "Strict",
      modes: {
        work: { label: "Робота", description: "Час сфокусованої роботи" },
        shortBreak: { label: "Коротка перерва", description: "Швидке відновлення" },
        longBreak: { label: "Довга перерва", description: "Глибше відновлення" }
      }
    },
    settings: {
      appearance: "Вигляд",
      blacklist: "Чорний список",
      blockedDomains: "Заблоковані домени",
      blockedSites: "Заблоковані сайти",
      desktopBlocker: "Desktop-блокувальник",
      domain: "Домен",
      domainError: "Введи коректний домен, якого ще немає в списку.",
      focusMode: "Режим фокусу",
      hostsEntries: "Записи hosts",
      languageTitle: "Мова інтерфейсу",
      lockouts: "Блокування",
      off: "Вимкнено",
      on: "Увімкнено",
      strictMode: "Strict Mode",
      theme: "Тема",
      toggleStrict: "Перемкнути Strict Mode",
      windowsHostsScript: "Windows hosts script"
    },
    stats: {
      bestStreak: "Найкращий стрік",
      completedPomodoros: "Завершені Pomodoro",
      currentStreak: "Поточний стрік",
      focusHistory: "Історія фокусу",
      lastSevenDays: "Останні 7 днів",
      minutes: "хвилин",
      noSessions: "Завершених сесій поки немає.",
      productiveMinutes: "Продуктивні хвилини",
      recentSessions: "Останні сесії",
      sessions: "Сесії",
      statistics: "Статистика",
      today: "Сьогодні",
      untitled: "Фокус-сесія без назви"
    },
    units: {
      dayShort: "д",
      hourShort: "г",
      minuteShort: "хв"
    }
  }
} as const;

export type Translation = (typeof translations)[AppLanguage];
