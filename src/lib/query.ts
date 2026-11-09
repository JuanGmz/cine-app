import { ApiError } from '@/api/client';

/** Retry network/server failures twice; never retry client errors (4xx). */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < 2;
}
