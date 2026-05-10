import { beforeEach, describe, expect, it } from "vitest";

import { useStrictModeStore } from "./useStrictModeStore";

describe("useStrictModeStore", () => {
  beforeEach(() => {
    useStrictModeStore.setState({
      blockedSites: [],
      enabled: false,
      lockedResetAttempts: 0
    });
  });

  it("toggles and sets strict mode enabled state", () => {
    useStrictModeStore.getState().toggleEnabled();
    expect(useStrictModeStore.getState().enabled).toBe(true);

    useStrictModeStore.getState().setEnabled(false);
    expect(useStrictModeStore.getState().enabled).toBe(false);
  });

  it("adds normalized blocked sites", () => {
    expect(useStrictModeStore.getState().addBlockedSite("www.Reddit.com")).toBe(
      true
    );

    expect(useStrictModeStore.getState().blockedSites).toEqual([
      { domain: "reddit.com", id: "reddit.com" }
    ]);
  });

  it("rejects duplicate and invalid blocked sites", () => {
    expect(useStrictModeStore.getState().addBlockedSite("reddit.com")).toBe(true);
    expect(useStrictModeStore.getState().addBlockedSite("www.reddit.com")).toBe(
      false
    );
    expect(useStrictModeStore.getState().addBlockedSite("localhost")).toBe(false);
    expect(useStrictModeStore.getState().blockedSites).toHaveLength(1);
  });

  it("removes blocked sites by id", () => {
    useStrictModeStore.setState({
      blockedSites: [
        { domain: "reddit.com", id: "reddit.com" },
        { domain: "youtube.com", id: "youtube.com" }
      ]
    });

    useStrictModeStore.getState().removeBlockedSite("reddit.com");

    expect(useStrictModeStore.getState().blockedSites).toEqual([
      { domain: "youtube.com", id: "youtube.com" }
    ]);
  });

  it("records locked reset attempts", () => {
    useStrictModeStore.getState().recordLockedResetAttempt();
    useStrictModeStore.getState().recordLockedResetAttempt();

    expect(useStrictModeStore.getState().lockedResetAttempts).toBe(2);
  });
});
