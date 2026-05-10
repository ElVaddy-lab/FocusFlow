import { describe, expect, it } from "vitest";

import {
  createPersistedStateFile,
  parsePersistedStateFile
} from "./persistedState";

const now = new Date("2026-05-08T12:00:00.000Z");

describe("persisted state file parsing", () => {
  it("migrates old flat store files into the envelope format", () => {
    const result = parsePersistedStateFile(
      JSON.stringify({
        "focusflow-theme": "{\"state\":{\"mode\":\"dark\"},\"version\":0}",
        "focusflow-unknown": "ignored"
      }),
      now
    );

    expect(result.reason).toBe("flat");
    expect(result.shouldBackup).toBe(true);
    expect(result.shouldRewrite).toBe(true);
    expect(result.state).toEqual({
      schemaVersion: 1,
      stores: {
        "focusflow-theme": "{\"state\":{\"mode\":\"dark\"},\"version\":0}"
      },
      updatedAt: "2026-05-08T12:00:00.000Z"
    });
  });

  it("loads valid envelope files without requesting a backup", () => {
    const state = createPersistedStateFile(
      {
        "focusflow-language": "{\"state\":{\"language\":\"uk\"},\"version\":1}"
      },
      now
    );
    const result = parsePersistedStateFile(JSON.stringify(state), now);

    expect(result.reason).toBe("envelope");
    expect(result.shouldBackup).toBe(false);
    expect(result.shouldRewrite).toBe(false);
    expect(result.state.stores["focusflow-language"]).toContain("uk");
  });

  it("recovers from corrupt JSON with an empty state and backup request", () => {
    const result = parsePersistedStateFile("{", now);

    expect(result.reason).toBe("corrupt");
    expect(result.shouldBackup).toBe(true);
    expect(result.shouldRewrite).toBe(true);
    expect(result.state).toEqual({
      schemaVersion: 1,
      stores: {},
      updatedAt: "2026-05-08T12:00:00.000Z"
    });
  });
});
