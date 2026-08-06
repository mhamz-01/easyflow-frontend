import { getApiErrorStatus } from "./client";

// Right after sign-up, Clerk's session exists on the client before our
// backend has necessarily finished mirroring the user via webhook, and the
// session cookie itself can lag a beat behind the redirect. So 404 ("account
// not provisioned yet"), 401 (cookie not yet readable) and network/5xx
// hiccups are all worth retrying with backoff — but capped, so a genuine
// failure surfaces instead of spinning forever.
export const READY_CHECK_MAX_RETRIES = 8; // ~ up to ~30s of backoff below
export const READY_CHECK_RETRY_DELAY = (attempt: number) =>
  Math.min(1000 * 2 ** attempt, 5000);

export const isTransientStatus = (status: number | undefined) =>
  status === undefined || status === 401 || status === 404 || status >= 500;

export const shouldRetryTransient = (attempts: number, err: unknown) =>
  isTransientStatus(getApiErrorStatus(err)) && attempts < READY_CHECK_MAX_RETRIES;
