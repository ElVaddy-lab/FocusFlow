export interface IpcRateLimitOptions {
  maxRequests: number;
  now?: () => number;
  windowMs: number;
}

export class IpcRateLimiter {
  private readonly buckets = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly now: () => number;
  private readonly windowMs: number;

  constructor({ maxRequests, now, windowMs }: IpcRateLimitOptions) {
    this.maxRequests = Math.max(1, maxRequests);
    this.now = now ?? Date.now;
    this.windowMs = Math.max(1, windowMs);
  }

  allow(bucket: string): boolean {
    const currentTime = this.now();
    const windowStart = currentTime - this.windowMs;
    const timestamps = this.buckets
      .get(bucket)
      ?.filter((timestamp) => timestamp > windowStart) ?? [];

    if (timestamps.length >= this.maxRequests) {
      this.buckets.set(bucket, timestamps);
      return false;
    }

    timestamps.push(currentTime);
    this.buckets.set(bucket, timestamps);

    return true;
  }

  reset(): void {
    this.buckets.clear();
  }
}
