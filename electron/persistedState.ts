export const PERSISTED_STATE_SCHEMA_VERSION = 1;

export const persistedStoreKeys = [
  "focusflow-theme",
  "focusflow-language",
  "focusflow-tasks",
  "focusflow-timer",
  "focusflow-goal",
  "focusflow-strict-mode",
  "focusflow-stats",
  "focusflow-audio-settings"
] as const;

export type PersistedStoreKey = (typeof persistedStoreKeys)[number];

export interface FocusFlowStateFile {
  schemaVersion: typeof PERSISTED_STATE_SCHEMA_VERSION;
  stores: Partial<Record<PersistedStoreKey, string>>;
  updatedAt: string;
}

export interface FocusFlowBackupFile {
  appVersion: string;
  exportedAt: string;
  state: FocusFlowStateFile;
}

export interface BackupResult {
  importedStores?: number;
  message: string;
  path?: string;
  success: boolean;
}

export interface ParsedPersistedState {
  reason: "corrupt" | "envelope" | "flat" | "invalid";
  shouldBackup: boolean;
  shouldRewrite: boolean;
  state: FocusFlowStateFile;
}

export function isPersistedStoreKey(value: unknown): value is PersistedStoreKey {
  return (
    typeof value === "string" &&
    persistedStoreKeys.includes(value as PersistedStoreKey)
  );
}

export function createEmptyPersistedState(now = new Date()): FocusFlowStateFile {
  return {
    schemaVersion: PERSISTED_STATE_SCHEMA_VERSION,
    stores: {},
    updatedAt: now.toISOString()
  };
}

export function createPersistedStateFile(
  stores: Partial<Record<PersistedStoreKey, string>>,
  now = new Date()
): FocusFlowStateFile {
  return {
    schemaVersion: PERSISTED_STATE_SCHEMA_VERSION,
    stores: filterPersistedStores(stores),
    updatedAt: now.toISOString()
  };
}

export function parsePersistedStateFile(
  content: string,
  now = new Date()
): ParsedPersistedState {
  try {
    const parsed = JSON.parse(content) as unknown;

    if (!isPlainRecord(parsed)) {
      return invalidResult("invalid", now);
    }

    if ("stores" in parsed || "schemaVersion" in parsed) {
      const stores = isPlainRecord(parsed.stores)
        ? filterPersistedStores(parsed.stores)
        : {};
      const updatedAt =
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : now.toISOString();

      return {
        reason: "envelope",
        shouldBackup:
          parsed.schemaVersion !== PERSISTED_STATE_SCHEMA_VERSION ||
          !isPlainRecord(parsed.stores),
        shouldRewrite:
          parsed.schemaVersion !== PERSISTED_STATE_SCHEMA_VERSION ||
          !isPlainRecord(parsed.stores),
        state: {
          schemaVersion: PERSISTED_STATE_SCHEMA_VERSION,
          stores,
          updatedAt
        }
      };
    }

    return {
      reason: "flat",
      shouldBackup: true,
      shouldRewrite: true,
      state: createPersistedStateFile(filterPersistedStores(parsed), now)
    };
  } catch {
    return invalidResult("corrupt", now);
  }
}

export function parseBackupFile(content: string): FocusFlowBackupFile | null {
  try {
    const parsed = JSON.parse(content) as unknown;

    if (!isPlainRecord(parsed) || !isPlainRecord(parsed.state)) {
      return null;
    }

    const state = parsePersistedStateFile(JSON.stringify(parsed.state)).state;

    return {
      appVersion:
        typeof parsed.appVersion === "string" ? parsed.appVersion : "unknown",
      exportedAt:
        typeof parsed.exportedAt === "string"
          ? parsed.exportedAt
          : new Date().toISOString(),
      state
    };
  } catch {
    return null;
  }
}

function invalidResult(
  reason: "corrupt" | "invalid",
  now: Date
): ParsedPersistedState {
  return {
    reason,
    shouldBackup: true,
    shouldRewrite: true,
    state: createEmptyPersistedState(now)
  };
}

function filterPersistedStores(
  stores: Record<string, unknown>
): Partial<Record<PersistedStoreKey, string>> {
  return Object.entries(stores).reduce<Partial<Record<PersistedStoreKey, string>>>(
    (filtered, [key, value]) => {
      if (isPersistedStoreKey(key) && typeof value === "string") {
        filtered[key] = value;
      }

      return filtered;
    },
    {}
  );
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
