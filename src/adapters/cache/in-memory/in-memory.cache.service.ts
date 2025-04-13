/* eslint-disable @typescript-eslint/require-await */
import { ICacheService } from 'src/domain/abstract/cache.service.interface';

type CacheEntry = {
  value: any;
  expiresAt?: number; // timestamp (ms)
};

export class InMemoryCacheService implements ICacheService {
  private cache: Record<string, CacheEntry> = {};

  async set(key: string, value: any, ttlInSeconds?: number): Promise<void> {
    const expiresAt = ttlInSeconds
      ? Date.now() + ttlInSeconds * 1000
      : undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.cache[key] = { value, expiresAt };
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = this.cache[key];

    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      delete this.cache[key];
      return null;
    }

    return entry.value as T;
  }

  async delete(key: string): Promise<void> {
    delete this.cache[key];
  }

  async clear(): Promise<void> {
    this.cache = {};
  }
}
