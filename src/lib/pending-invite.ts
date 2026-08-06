// Durable copy of "where to go back to after auth" for the invited-but-
// unregistered flow: /accept-invitation is public, so when a logged-out
// visitor chooses to sign up/in we stash the invite URL here before
// navigating away. sessionStorage (not localStorage) because this is only
// relevant for the current signup/login attempt, not future visits.
const PENDING_INVITE_RETURN_KEY = "easyflow:pendingInviteReturnTo";

export const storePendingInviteReturn = (url: string) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_INVITE_RETURN_KEY, url);
};

// Reads and clears in one step — the value is only meant to be consumed once,
// so it can't leak into an unrelated future sign-in in the same browser.
export const consumePendingInviteReturn = (): string | null => {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(PENDING_INVITE_RETURN_KEY);
  if (value) window.sessionStorage.removeItem(PENDING_INVITE_RETURN_KEY);
  return value;
};
