import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createPersistedStateFile } from "./persistedState";
import { PersistedStateStorage } from "./persistedStateStorage";

let tempDir: string;
let storage: PersistedStateStorage;

async function readStateFile(): Promise<unknown> {
  return JSON.parse(await fs.readFile(storage.getStatePath(), "utf8"));
}

describe("PersistedStateStorage", () => {
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "focusflow-state-"));
    storage = new PersistedStateStorage(tempDir);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { force: true, recursive: true });
  });

  it("serializes parallel store writes without losing either value", async () => {
    await Promise.all([
      storage.setStoreValue(
        "focusflow-theme",
        "{\"state\":{\"mode\":\"dark\"},\"version\":1}"
      ),
      storage.setStoreValue(
        "focusflow-language",
        "{\"state\":{\"language\":\"uk\"},\"version\":1}"
      )
    ]);

    const state = await storage.readState();

    expect(state.stores).toEqual({
      "focusflow-language": "{\"state\":{\"language\":\"uk\"},\"version\":1}",
      "focusflow-theme": "{\"state\":{\"mode\":\"dark\"},\"version\":1}"
    });
  });

  it("runs set and remove operations in queue order", async () => {
    await Promise.all([
      storage.setStoreValue(
        "focusflow-theme",
        "{\"state\":{\"mode\":\"dark\"},\"version\":1}"
      ),
      storage.removeStoreValue("focusflow-theme")
    ]);

    const state = await storage.readState();

    expect(state.stores["focusflow-theme"]).toBeUndefined();
  });

  it("waits for queued writes before reading state", async () => {
    const writePromise = storage.setStoreValue(
      "focusflow-stats",
      "{\"state\":{\"sessions\":[]},\"version\":1}"
    );
    const readPromise = storage.readState();

    await writePromise;
    const state = await readPromise;

    expect(state.stores["focusflow-stats"]).toBe(
      "{\"state\":{\"sessions\":[]},\"version\":1}"
    );
  });

  it("backs up and rewrites corrupt JSON during recovery", async () => {
    await fs.writeFile(storage.getStatePath(), "{", "utf8");

    const state = await storage.readState();
    const files = await fs.readdir(tempDir);
    const backupFileName = files.find((file) =>
      file.startsWith("focusflow-state.backup-")
    );

    expect(state.stores).toEqual({});
    expect(await readStateFile()).toMatchObject({
      schemaVersion: 1,
      stores: {}
    });
    expect(backupFileName).toBeDefined();
    expect(
      await fs.readFile(path.join(tempDir, backupFileName ?? ""), "utf8")
    ).toBe("{");
  });

  it("keeps a queued store write after replacing state from backup", async () => {
    await storage.setStoreValue(
      "focusflow-theme",
      "{\"state\":{\"mode\":\"light\"},\"version\":1}"
    );

    await Promise.all([
      storage.replaceStateFromBackup(
        createPersistedStateFile({
          "focusflow-language":
            "{\"state\":{\"language\":\"uk\"},\"version\":1}"
        })
      ),
      storage.setStoreValue(
        "focusflow-theme",
        "{\"state\":{\"mode\":\"dark\"},\"version\":1}"
      )
    ]);

    const state = await storage.readState();

    expect(state.stores).toEqual({
      "focusflow-language": "{\"state\":{\"language\":\"uk\"},\"version\":1}",
      "focusflow-theme": "{\"state\":{\"mode\":\"dark\"},\"version\":1}"
    });
  });
});
