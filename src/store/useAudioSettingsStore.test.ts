import { beforeEach, describe, expect, it } from "vitest";

import { useAudioSettingsStore } from "./useAudioSettingsStore";

describe("useAudioSettingsStore", () => {
  beforeEach(() => {
    useAudioSettingsStore.setState({
      enabled: true,
      volume: 0.6
    });
  });

  it("toggles audio notifications", () => {
    useAudioSettingsStore.getState().setEnabled(false);

    expect(useAudioSettingsStore.getState().enabled).toBe(false);
  });

  it("clamps volume into the allowed range", () => {
    useAudioSettingsStore.getState().setVolume(2);
    expect(useAudioSettingsStore.getState().volume).toBe(1);

    useAudioSettingsStore.getState().setVolume(-1);
    expect(useAudioSettingsStore.getState().volume).toBe(0);
  });

  it("falls back to zero for invalid volume input", () => {
    useAudioSettingsStore.getState().setVolume(Number.NaN);

    expect(useAudioSettingsStore.getState().volume).toBe(0);
  });
});
