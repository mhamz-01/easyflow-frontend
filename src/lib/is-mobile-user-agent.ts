const MOBILE_UA_REGEX =
  /Android|iPhone|iPod|IEMobile|BlackBerry|Opera Mini|Mobile(?!.*iPad)/i;

export function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_REGEX.test(userAgent);
}
