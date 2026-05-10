import type { NavigationSection } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import { navigationItems } from "./navigationItems";

interface NavigationProps {
  activeSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
}

export function Navigation({
  activeSection,
  onSelectSection
}: NavigationProps) {
  const { t } = useTranslation();

  return (
    <nav
      aria-label="Primary"
      className="flex h-max gap-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:flex-col"
    >
      {navigationItems.map((item) => {
        const isActive = item === activeSection;
        const navigationItem = t.nav[item];

        return (
          <button
            aria-current={isActive ? "page" : undefined}
            className={[
              "rounded-md px-3 py-2 text-left transition",
              isActive
                ? "bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-100"
                : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            ].join(" ")}
            key={item}
            onClick={() => onSelectSection(item)}
            type="button"
          >
            <span className="block text-sm font-semibold">
              {navigationItem.label}
            </span>
            <span className="mt-1 hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
              {navigationItem.description}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
