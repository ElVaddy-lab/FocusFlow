import { useEffect } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import type { NavigationSection, ThemeMode } from "../../types";
import { Navigation } from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";

interface AppLayoutProps {
  activeSection: NavigationSection;
  children: React.ReactNode;
  mode: ThemeMode;
  onSelectSection: (section: NavigationSection) => void;
  onToggleTheme: () => void;
}

export function AppLayout({
  activeSection,
  children,
  mode,
  onSelectSection,
  onToggleTheme
}: AppLayoutProps) {
  const { language, t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 antialiased transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-6 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700 dark:text-teal-300">
              FocusFlow
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
              {t.app.title}
            </h1>
          </div>

          <ThemeToggle mode={mode} onToggle={onToggleTheme} />
        </header>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[240px_1fr]">
          <Navigation
            activeSection={activeSection}
            onSelectSection={onSelectSection}
          />

          <section className="min-w-0" key={activeSection}>
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
