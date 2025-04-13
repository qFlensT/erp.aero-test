export abstract class ICacheService {
  abstract set(key: string, value: any): Promise<void>;
  abstract get<T = unknown>(key: string): Promise<T | null>;
  abstract delete(key: string): Promise<void>;
  abstract clear(): Promise<void>;
}
