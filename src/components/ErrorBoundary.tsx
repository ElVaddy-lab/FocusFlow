import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const fallbackCopy = {
  en: {
    body: "Something went wrong while loading FocusFlow. The error was logged for debugging.",
    reload: "Reload app",
    title: "FocusFlow could not load"
  },
  uk: {
    body: "Під час запуску FocusFlow сталася помилка. Її записано в лог для діагностики.",
    reload: "Перезавантажити",
    title: "FocusFlow не вдалося запустити"
  }
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    void window.focusFlow?.reportError?.({
      context: info.componentStack ?? undefined,
      message: error.message,
      stack: error.stack
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const language = navigator.language.toLowerCase().startsWith("uk")
      ? "uk"
      : "en";
    const copy = fallbackCopy[language];

    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 text-zinc-950 dark:bg-zinc-950 dark:text-white">
        <section className="w-full max-w-md rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold">{copy.title}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {copy.body}
          </p>
          <button
            className="mt-5 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            onClick={() => window.location.reload()}
            type="button"
          >
            {copy.reload}
          </button>
        </section>
      </main>
    );
  }
}
