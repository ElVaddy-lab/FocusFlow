import { describe, expect, it, vi } from "vitest";

import { invokeIpc, type IpcInvoker } from "./ipcInvoke";

describe("invokeIpc", () => {
  it("resolves successful invokes before timeout", async () => {
    const invoke = vi.fn<IpcInvoker>();
    invoke.mockResolvedValue("ok");

    await expect(
      invokeIpc(invoke, "focusflow:test", ["value"], { timeoutMs: 100 })
    ).resolves.toBe("ok");
    expect(invoke).toHaveBeenCalledWith("focusflow:test", "value");
  });

  it("rejects hung invokes with a timeout error", async () => {
    vi.useFakeTimers();

    const invoke = vi.fn<IpcInvoker>();
    invoke.mockReturnValue(new Promise<unknown>(() => undefined));
    const result = invokeIpc(invoke, "focusflow:hung", [], { timeoutMs: 100 });
    const expectation = expect(result).rejects.toThrow(
      "IPC invoke failed for focusflow:hung: IPC invoke timed out after 100ms."
    );

    await vi.advanceTimersByTimeAsync(100);
    await expectation;
    vi.useRealTimers();
  });

  it("succeeds after a transient failure when retries are enabled", async () => {
    const invoke = vi.fn<IpcInvoker>();
    invoke
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce("ok");

    await expect(
      invokeIpc(invoke, "focusflow:retry", [], {
        retries: 1,
        retryDelayMs: 0,
        timeoutMs: 100
      })
    ).resolves.toBe("ok");
    expect(invoke).toHaveBeenCalledTimes(2);
  });

  it("stops retrying after the configured retry limit", async () => {
    const invoke = vi.fn<IpcInvoker>();
    invoke.mockRejectedValue(new Error("still failing"));

    await expect(
      invokeIpc(invoke, "focusflow:retry-limit", [], {
        retries: 2,
        retryDelayMs: 0,
        timeoutMs: 100
      })
    ).rejects.toThrow(
      "IPC invoke failed for focusflow:retry-limit: still failing"
    );
    expect(invoke).toHaveBeenCalledTimes(3);
  });

  it("does not retry when retries are disabled", async () => {
    const invoke = vi.fn<IpcInvoker>();
    invoke.mockRejectedValue(new Error("failed"));

    await expect(
      invokeIpc(invoke, "focusflow:no-retry", [], {
        retries: 0,
        timeoutMs: 100
      })
    ).rejects.toThrow("IPC invoke failed for focusflow:no-retry: failed");
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("waits for the configured delay before retrying", async () => {
    vi.useFakeTimers();

    const invoke = vi.fn<IpcInvoker>();
    invoke.mockRejectedValueOnce(new Error("temporary")).mockResolvedValue("ok");
    const result = invokeIpc(invoke, "focusflow:delay", [], {
      retries: 1,
      retryDelayMs: 250,
      timeoutMs: 100
    });

    await Promise.resolve();
    expect(invoke).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(249);
    expect(invoke).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toBe("ok");
    expect(invoke).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
