import fs from "node:fs/promises";
import path from "node:path";

type LogLevel = "debug" | "error" | "info" | "warn";

let logRootPath: string | null = null;

export function configureLogger(userDataPath: string): void {
  logRootPath = path.join(userDataPath, "logs");
}

export function logDebug(message: string, details?: unknown): void {
  void writeLog("debug", message, details);
}

export function logError(message: string, details?: unknown): void {
  console.error(message, details ?? "");
  void writeLog("error", message, details);
}

export function logInfo(message: string, details?: unknown): void {
  void writeLog("info", message, details);
}

export function logWarn(message: string, details?: unknown): void {
  console.warn(message, details ?? "");
  void writeLog("warn", message, details);
}

async function writeLog(
  level: LogLevel,
  message: string,
  details?: unknown
): Promise<void> {
  if (!logRootPath) {
    return;
  }

  try {
    const now = new Date();
    const fileName = `focusflow-${now.toISOString().slice(0, 10)}.log`;
    const line = JSON.stringify({
      at: now.toISOString(),
      details: serializeDetails(details),
      level,
      message
    });

    await fs.mkdir(logRootPath, { recursive: true });
    await fs.appendFile(path.join(logRootPath, fileName), `${line}\n`, "utf8");
  } catch (error) {
    console.error("Failed to write FocusFlow log.", error);
  }
}

function serializeDetails(details: unknown): unknown {
  if (details instanceof Error) {
    return {
      message: details.message,
      name: details.name,
      stack: details.stack
    };
  }

  return details;
}
