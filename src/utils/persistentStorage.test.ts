import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { persistentStorage } from "./persistentStorage";

const themeValue = "{\"state\":{\"mode\":\"dark\"},\"version\":1}";

describe("persistentStorage", () => {
  let localStorageValues: Map<string, string>;

  beforeEach(() => {
    localStorageValues = new Map();

    vi.stubGlobal("window", {
      focusFlow: {
        getPersistedValue: vi.fn().mockRejectedValue(new Error("IPC timeout")),
        removePersistedValue: vi.fn().mockRejectedValue(new Error("IPC timeout")),
        reportError: vi.fn().mockResolvedValue(undefined),
        setPersistedValue: vi.fn().mockRejectedValue(new Error("IPC timeout"))
      },
      localStorage: {
        getItem: vi.fn((key: string) => localStorageValues.get(key) ?? null),
        removeItem: vi.fn((key: string) => {
          localStorageValues.delete(key);
        }),
        setItem: vi.fn((key: string, value: string) => {
          localStorageValues.set(key, value);
        })
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("falls back to localStorage when Electron get rejects", async () => {
    localStorageValues.set("focusflow-theme", themeValue);

    await expect(persistentStorage.getItem("focusflow-theme")).resolves.toBe(
      themeValue
    );
    expect(window.focusFlow?.reportError).toHaveBeenCalled();
  });

  it("writes localStorage before reporting Electron set failures", async () => {
    await expect(
      persistentStorage.setItem("focusflow-theme", themeValue)
    ).resolves.toBeUndefined();

    expect(localStorageValues.get("focusflow-theme")).toBe(themeValue);
    expect(window.focusFlow?.setPersistedValue).toHaveBeenCalledWith(
      "focusflow-theme",
      themeValue
    );
    expect(window.focusFlow?.reportError).toHaveBeenCalled();
  });

  it("removes localStorage even when Electron remove rejects", async () => {
    localStorageValues.set("focusflow-theme", themeValue);

    await expect(
      persistentStorage.removeItem("focusflow-theme")
    ).resolves.toBeUndefined();

    expect(localStorageValues.has("focusflow-theme")).toBe(false);
    expect(window.focusFlow?.removePersistedValue).toHaveBeenCalledWith(
      "focusflow-theme"
    );
    expect(window.focusFlow?.reportError).toHaveBeenCalled();
  });
});
