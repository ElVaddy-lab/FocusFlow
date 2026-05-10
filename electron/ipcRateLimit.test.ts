import { describe, expect, it } from "vitest";

import { IpcRateLimiter } from "./ipcRateLimit";

describe("IpcRateLimiter", () => {
  it("allows requests up to the configured limit", () => {
    let now = 1000;
    const limiter = new IpcRateLimiter({
      maxRequests: 3,
      now: () => now,
      windowMs: 1000
    });

    expect(limiter.allow("focusflow:test")).toBe(true);
    now += 100;
    expect(limiter.allow("focusflow:test")).toBe(true);
    now += 100;
    expect(limiter.allow("focusflow:test")).toBe(true);
  });

  it("blocks requests after the limit is exceeded", () => {
    const limiter = new IpcRateLimiter({
      maxRequests: 2,
      now: () => 1000,
      windowMs: 1000
    });

    expect(limiter.allow("focusflow:test")).toBe(true);
    expect(limiter.allow("focusflow:test")).toBe(true);
    expect(limiter.allow("focusflow:test")).toBe(false);
  });

  it("allows requests again after the window expires", () => {
    let now = 1000;
    const limiter = new IpcRateLimiter({
      maxRequests: 2,
      now: () => now,
      windowMs: 1000
    });

    expect(limiter.allow("focusflow:test")).toBe(true);
    now += 100;
    expect(limiter.allow("focusflow:test")).toBe(true);
    now += 901;
    expect(limiter.allow("focusflow:test")).toBe(true);
  });

  it("keeps separate buckets isolated", () => {
    const limiter = new IpcRateLimiter({
      maxRequests: 1,
      now: () => 1000,
      windowMs: 1000
    });

    expect(limiter.allow("focusflow:first")).toBe(true);
    expect(limiter.allow("focusflow:first")).toBe(false);
    expect(limiter.allow("focusflow:second")).toBe(true);
  });

  it("handles a one-request limit", () => {
    let now = 1000;
    const limiter = new IpcRateLimiter({
      maxRequests: 1,
      now: () => now,
      windowMs: 500
    });

    expect(limiter.allow("focusflow:test")).toBe(true);
    expect(limiter.allow("focusflow:test")).toBe(false);
    now += 501;
    expect(limiter.allow("focusflow:test")).toBe(true);
  });
});
