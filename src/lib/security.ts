const SAME_ORIGIN_FALLBACK = '/';

const hasControlChars = (value: string) => /[\r\n\t]/.test(value);

const isSafeRelativePath = (value: string) => {
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.includes('\\')) return false;
  if (hasControlChars(value)) return false;
  return true;
};

export const getSafeRedirectPath = (candidate: string | null | undefined, fallback = SAME_ORIGIN_FALLBACK) => {
  if (!candidate) return fallback;
  const raw = candidate.trim();
  if (!raw) return fallback;

  if (isSafeRelativePath(raw)) {
    return raw;
  }

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    const next = `${url.pathname}${url.search}${url.hash}`;
    return isSafeRelativePath(next) ? next : fallback;
  } catch {
    return fallback;
  }
};

export const getSafeExternalUrl = (candidate: string | null | undefined) => {
  if (!candidate) return null;
  const raw = candidate.trim();
  if (!raw || hasControlChars(raw)) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
};
