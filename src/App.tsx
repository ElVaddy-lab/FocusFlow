import { motion } from "framer-motion";
import { useState } from "react";

import { AppLayout } from "./components/layout/AppLayout";
import { BackupPanel } from "./components/settings/BackupPanel";
import { LanguageSelect } from "./components/settings/LanguageSelect";
import { StrictModePanel } from "./components/settings/StrictModePanel";
import { DailyGoalProgress } from "./components/stats/DailyGoalProgress";
import { StatsDashboard } from "./components/stats/StatsDashboard";
import { TaskList } from "./components/tasks/TaskList";
import { TodayQueue } from "./components/tasks/TodayQueue";
import { MiniTimerWindow } from "./components/timer/MiniTimerWindow";
import { TimerPanel } from "./components/timer/TimerPanel";
import { useBlocker } from "./hooks/useBlocker";
import { usePomodoroSessionRecorder } from "./hooks/usePomodoroSessionRecorder";
import { useTimerBridge } from "./hooks/useTimerBridge";
import { useTimerNotifications } from "./hooks/useTimerNotifications";
import { useTranslation } from "./hooks/useTranslation";
import { useTimer } from "./hooks/useTimer";
import { useTaskStore } from "./store/useTaskStore";
import { useThemeStore } from "./store/useThemeStore";
import type { NavigationSection } from "./types";

function App() {
  const isMiniView = new URLSearchParams(window.location.search).get("view") === "mini";

  if (isMiniView) {
    return <MiniTimerWindow />;
  }

  usePomodoroSessionRecorder();
  useTimerNotifications();

  const [activeSection, setActiveSection] =
    useState<NavigationSection>("dashboard");
  const tasks = useTaskStore((state) => state.tasks);
  const timer = useTimer();
  const blocker = useBlocker();
  const { t } = useTranslation();
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const activeTask = tasks.find((task) => task.id === timer.activeTaskId);

  useTimerBridge({
    activeTaskTitle: activeTask?.title ?? null,
    isStrictSessionActive: blocker.isStrictSessionActive,
    onLockedResetAttempt: blocker.recordLockedResetAttempt,
    timer
  });

  return (
    <AppLayout
      activeSection={activeSection}
      mode={mode}
      onSelectSection={setActiveSection}
      onToggleTheme={toggleMode}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
        initial={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <section>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.pages[activeSection].eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {t.pages[activeSection].title}
          </h2>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.dashboardCards.tasks}
            </p>
            <p className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
              {tasks.length}
            </p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.dashboardCards.timer}
            </p>
            <p className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
              {timer.formattedTime}
            </p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.dashboardCards.completed}
            </p>
            <p className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
              {completedTasks.length}
            </p>
          </div>
        </div>

        {activeSection === "dashboard" && (
          <>
            <DailyGoalProgress />
            <StatsDashboard />
            <TodayQueue />
            <TaskList />
          </>
        )}
        {activeSection === "timer" && (
          <TimerPanel
            isStrictSessionActive={blocker.isStrictSessionActive}
            onLockedResetAttempt={blocker.recordLockedResetAttempt}
            tasks={tasks}
            timer={timer}
          />
        )}
        {activeSection === "settings" && (
          <div className="space-y-6">
            <section className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {t.settings.appearance}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                    {t.settings.theme}
                  </h3>
                </div>
                <span className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium capitalize text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
                  {mode === "dark" ? t.common.dark : t.common.light}
                </span>
              </div>
              <div className="mt-5 max-w-xs">
                <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {t.settings.languageTitle}
                </p>
                <LanguageSelect />
              </div>
            </section>
            <BackupPanel />
            <StrictModePanel />
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}

export default App;
