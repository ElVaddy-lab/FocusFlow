import fs from "node:fs/promises";
import path from "node:path";

import { logError, logInfo } from "./logger";
import {
  createPersistedStateFile,
  parsePersistedStateFile,
  type FocusFlowStateFile,
  type PersistedStoreKey
} from "./persistedState";

const persistedStateFileName = "focusflow-state.json";

export class PersistedStateStorage {
  private operationQueue: Promise<void> = Promise.resolve();

  constructor(private readonly userDataPath: string) {}

  getStatePath(): string {
    return path.join(this.userDataPath, persistedStateFileName);
  }

  readState(): Promise<FocusFlowStateFile> {
    return this.enqueue(() => this.readStateFromDisk());
  }

  setStoreValue(key: PersistedStoreKey, value: string): Promise<void> {
    return this.enqueue(async () => {
      const state = await this.readStateFromDisk();

      await this.writeStateToDisk(
        createPersistedStateFile({
          ...state.stores,
          [key]: value
        })
      );
    });
  }

  removeStoreValue(key: PersistedStoreKey): Promise<void> {
    return this.enqueue(async () => {
      const state = await this.readStateFromDisk();
      const nextStores = { ...state.stores };
      delete nextStores[key];

      await this.writeStateToDisk(createPersistedStateFile(nextStores));
    });
  }

  replaceStateFromBackup(state: FocusFlowStateFile): Promise<void> {
    return this.enqueue(async () => {
      const currentState = await this.readStateFromDisk();

      await this.backupStateContent(
        JSON.stringify(currentState, null, 2),
        "before-import"
      );
      await this.writeStateToDisk(createPersistedStateFile(state.stores));
    });
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const queuedOperation = this.operationQueue.then(operation, operation);
    this.operationQueue = queuedOperation.then(
      () => undefined,
      () => undefined
    );

    return queuedOperation;
  }

  private async readStateFromDisk(): Promise<FocusFlowStateFile> {
    try {
      const content = await fs.readFile(this.getStatePath(), "utf8");
      const parsed = parsePersistedStateFile(content);

      if (parsed.shouldBackup) {
        await this.backupStateContent(content, parsed.reason);
      }

      if (parsed.shouldRewrite) {
        await this.writeStateToDisk(parsed.state);
        logInfo("Rewrote FocusFlow state file.", { reason: parsed.reason });
      }

      return parsed.state;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === "ENOENT") {
        return createPersistedStateFile({});
      }

      logError("Failed to read FocusFlow state.", error);
      return createPersistedStateFile({});
    }
  }

  private async writeStateToDisk(state: FocusFlowStateFile): Promise<void> {
    const filePath = this.getStatePath();

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(state, null, 2), "utf8");
  }

  private async backupStateContent(
    content: string,
    reason: string
  ): Promise<void> {
    try {
      const filePath = this.getStatePath();
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\..+$/, "")
        .replace("T", "-");
      const backupPath = path.join(
        path.dirname(filePath),
        `focusflow-state.backup-${timestamp}.json`
      );

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(backupPath, content, "utf8");
      logInfo("Created FocusFlow state backup.", { backupPath, reason });
    } catch (error) {
      logError("Failed to create FocusFlow state backup.", error);
    }
  }
}
