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
    backup: {
      description:
        "Export or restore your local FocusFlow tasks, settings, and statistics as a JSON file.",
      eyebrow: "Data safety",
      export: "Export backup",
      failed: "Backup action failed.",
      import: "Import backup",
      storesImported: "stores imported.",
      title: "Backup and restore",
      unavailable: "Backup tools are only available in the desktop app."
    },
    goal: {
      completeMinutes: "Daily focus goal complete.",
      completePomodoros: "Daily Pomodoro goal complete.",
      eyebrow: "Daily goal",
      invalid: "Enter a value within the allowed range.",
      modes: {
        minutes: "Minutes",
        pomodoros: "Pomodoros"
      },
      progress: "Daily goal progress",
      remainingMinutes: "minutes remaining",
      remainingPomodoros: "Pomodoros remaining",
      target: "Target",
      title: "Today's focus goal"
    },
    task: {
      active: "active",
      addTask: "Add task",
      clearCompleted: "Clear completed",
      completed: "completed",
      empty: "No tasks yet.",
      errorTitle: "Enter a task title.",
      fieldEstimate: "Pomodoros",
      fieldNotes: "Notes",
      fieldPriority: "Priority",
      fieldTitle: "Task",
      addToday: "Add today",
      inToday: "Today",
      hideNotes: "Hide notes",
      manager: "Task manager",
      moveDown: "Move down",
      moveUp: "Move up",
      notToday: "Not today",
      notesPlaceholder: "Add context, links, or a short checklist",
      placeholder: "Write the next concrete task",
      pomodoroSingular: "pomodoro",
      pomodoroPlural: "pomodoros",
      priority: {
        high: "High",
        low: "Low",
        medium: "Medium"
      },
      removeToday: "Remove today",
      showNotes: "Show notes",
      title: "Plan the next focus block",
      todayCount: "in today's queue",
      todayEmpty: "No tasks in today's queue.",
      todayEyebrow: "Today",
      todayQueue: "Today queue",
      todayShort: "Today",
      total: "total"
    },
    timer: {
      focusTask: "Focus task",
      locked: "Locked",
      mini: "Mini",
      noActiveTasks: "No active tasks",
      noFocusTask: "No focus task selected",
      noTaskSelected: "No task selected",
      open: "Open",
      session: "Session",
      sessionLengths: "Session lengths",
      status: {
        idle: "Idle",
        paused: "Paused",
        running: "Running"
      },
      strict: "Strict",
      autoStart: {
        title: "Auto-start",
        modes: {
          all: {
            label: "Auto all",
            description: "Start every work and break transition."
          },
          breaks: {
            label: "Auto breaks",
            description: "Start breaks after work sessions."
          },
          manual: {
            label: "Manual",
            description: "Wait for Start after every transition."
          }
        }
      },
      modes: {
        work: { label: "Work", description: "Focused task time" },
        shortBreak: { label: "Short break", description: "Quick recovery" },
        longBreak: { label: "Long break", description: "Deeper reset" }
      }
    },
    notifications: {
      breakComplete: "Break finished. Next up: {nextMode}.",
      breakTitle: "Break complete",
      focusTitle: "Focus session complete",
      workComplete: "Nice work. Next up: {nextMode}.",
      workCompleteWithTask:
        "{taskTitle} is done for this round. Next up: {nextMode}."
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
      calendarHeatmap: "Calendar heatmap",
      completedPomodoros: "Completed Pomodoros",
      currentStreak: "Current streak",
      focusHistory: "Focus history",
      lastSevenDays: "Last 7 days",
      lastTwelveWeeks: "Last 12 weeks",
      less: "Less",
      minutes: "minutes",
      more: "More",
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
    backup: {
      description:
        "Експортуй або віднови локальні задачі, налаштування і статистику FocusFlow як JSON-файл.",
      eyebrow: "Безпека даних",
      export: "Експорт backup",
      failed: "Backup-дія не вдалася.",
      import: "Імпорт backup",
      storesImported: "stores імпортовано.",
      title: "Backup і відновлення",
      unavailable: "Backup доступний тільки у desktop-app."
    },
    goal: {
      completeMinutes: "Денну ціль фокусу виконано.",
      completePomodoros: "Денну Pomodoro-ціль виконано.",
      eyebrow: "Денна ціль",
      invalid: "Введи значення в дозволених межах.",
      modes: {
        minutes: "Хвилини",
        pomodoros: "Pomodoro"
      },
      progress: "Прогрес денної цілі",
      remainingMinutes: "хвилин залишилось",
      remainingPomodoros: "Pomodoro залишилось",
      target: "Ціль",
      title: "Фокус-ціль на сьогодні"
    },
    task: {
      active: "активні",
      addTask: "Додати завдання",
      clearCompleted: "Очистити виконані",
      completed: "виконані",
      empty: "Завдань поки немає.",
      errorTitle: "Введи назву завдання.",
      fieldEstimate: "Pomodoro",
      fieldNotes: "Нотатки",
      fieldPriority: "Пріоритет",
      addToday: "Додати на сьогодні",
      inToday: "Сьогодні",
      hideNotes: "Сховати нотатки",
      moveDown: "Перемістити вниз",
      moveUp: "Перемістити вгору",
      notToday: "Не сьогодні",
      notesPlaceholder: "Додай контекст, посилання або короткий чекліст",
      fieldTitle: "Завдання",
      manager: "Менеджер завдань",
      placeholder: "Запиши наступне конкретне завдання",
      pomodoroSingular: "pomodoro",
      pomodoroPlural: "pomodoro",
      priority: {
        high: "Високий",
        low: "Низький",
        medium: "Середній"
      },
      removeToday: "Прибрати зі сьогодні",
      showNotes: "Показати нотатки",
      todayCount: "у черзі на сьогодні",
      todayEmpty: "У черзі на сьогодні поки немає задач.",
      todayEyebrow: "Сьогодні",
      todayQueue: "Черга на сьогодні",
      todayShort: "Сьогодні",
      title: "Заплануй наступний фокус-блок",
      total: "усього"
    },
    timer: {
      focusTask: "Завдання для фокусу",
      locked: "Заблоковано",
      mini: "Міні",
      noActiveTasks: "Немає активних завдань",
      noFocusTask: "Завдання не вибрано",
      noTaskSelected: "Без вибраного завдання",
      open: "Відкрити",
      session: "Сесія",
      sessionLengths: "Тривалість сесій",
      status: {
        idle: "Готово",
        paused: "Пауза",
        running: "Запущено"
      },
      strict: "Strict",
      autoStart: {
        title: "Автостарт",
        modes: {
          all: {
            label: "Усе автоматично",
            description: "Автоматично стартувати роботу й перерви."
          },
          breaks: {
            label: "Перерви автоматично",
            description: "Автоматично стартувати перерви після роботи."
          },
          manual: {
            label: "Вручну",
            description: "Чекати Start після кожного переходу."
          }
        }
      },
      modes: {
        work: { label: "Робота", description: "Час сфокусованої роботи" },
        shortBreak: { label: "Коротка перерва", description: "Швидке відновлення" },
        longBreak: { label: "Довга перерва", description: "Глибше відновлення" }
      }
    },
    notifications: {
      breakComplete: "Перерва завершена. Далі: {nextMode}.",
      breakTitle: "Перерву завершено",
      focusTitle: "Фокус-сесію завершено",
      workComplete: "Гарна робота. Далі: {nextMode}.",
      workCompleteWithTask:
        "{taskTitle} завершено для цього раунду. Далі: {nextMode}."
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
      calendarHeatmap: "Календар фокусу",
      completedPomodoros: "Завершені Pomodoro",
      currentStreak: "Поточний стрік",
      focusHistory: "Історія фокусу",
      lastSevenDays: "Останні 7 днів",
      lastTwelveWeeks: "Останні 12 тижнів",
      less: "Менше",
      minutes: "хвилин",
      more: "Більше",
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
