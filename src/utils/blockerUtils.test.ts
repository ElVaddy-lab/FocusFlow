import { describe, expect, it } from "vitest";

import {
  createBlockedSite,
  createHostsEntries,
  createWindowsHostsScript,
  normalizeBlockedDomain
} from "./blockerUtils";

describe("blockerUtils", () => {
  it("normalizes plain domains", () => {
    expect(normalizeBlockedDomain("  Example.COM  ")).toBe("example.com");
  });

  it("normalizes URLs and strips a leading www subdomain", () => {
    expect(normalizeBlockedDomain("https://www.youtube.com/watch?v=1")).toBe(
      "youtube.com"
    );
  });

  it("rejects invalid domains", () => {
    expect(normalizeBlockedDomain("localhost")).toBeNull();
    expect(normalizeBlockedDomain("not a domain")).toBeNull();
  });

  it("creates blocked sites with stable ids", () => {
    expect(createBlockedSite("https://x.com/home")).toEqual({
      domain: "x.com",
      id: "x.com"
    });
  });

  it("creates hosts entries for root and www domains", () => {
    expect(createHostsEntries([{ domain: "reddit.com", id: "reddit.com" }])).toBe(
      "0.0.0.0 reddit.com\n0.0.0.0 www.reddit.com"
    );
  });

  it("returns an empty script when no blocked sites exist", () => {
    expect(createWindowsHostsScript([])).toBe("");
  });

  it("creates a marked PowerShell hosts script", () => {
    const script = createWindowsHostsScript([
      { domain: "reddit.com", id: "reddit.com" }
    ]);

    expect(script).toContain("# FocusFlow strict mode start");
    expect(script).toContain("# FocusFlow strict mode end");
    expect(script).toContain("Set-Content -LiteralPath $hostsPath");
    expect(script).toContain("0.0.0.0 reddit.com");
  });
});
