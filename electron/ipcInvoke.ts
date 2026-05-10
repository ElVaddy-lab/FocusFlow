export type IpcInvoker = (
  channel: string,
  ...args: unknown[]
) => Promise<unknown>;

export interface IpcInvokeOptions {
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

export async function invokeIpc<T>(
  invoke: IpcInvoker,
  channel: string,
  args: unknown[] = [],
  options: IpcInvokeOptions = {}
): Promise<T> {
  const retries = Math.max(0, options.retries ?? 0);
  const retryDelayMs = Math.max(0, options.retryDelayMs ?? 0);
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return (await invokeWithOptionalTimeout(
        invoke,
        channel,
        args,
        options.timeoutMs
      )) as T;
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        break;
      }

      await delay(retryDelayMs);
    }
  }

  throw createInvokeError(channel, lastError);
}

function invokeWithOptionalTimeout(
  invoke: IpcInvoker,
  channel: string,
  args: unknown[],
  timeoutMs: number | undefined
): Promise<unknown> {
  if (timeoutMs === undefined) {
    return invoke(channel, ...args);
  }

  const safeTimeoutMs = Math.max(1, timeoutMs);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`IPC invoke timed out after ${safeTimeoutMs}ms.`));
    }, safeTimeoutMs);
  });

  return Promise.race([invoke(channel, ...args), timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

function createInvokeError(channel: string, cause: unknown): Error {
  const message = cause instanceof Error ? cause.message : String(cause);
  const error = new Error(`IPC invoke failed for ${channel}: ${message}`);

  if (cause instanceof Error) {
    error.stack = cause.stack;
  }

  return error;
}

function delay(delayMs: number): Promise<void> {
  if (delayMs <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
