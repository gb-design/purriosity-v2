const DEFAULT_FOCUS_X = 50;
const DEFAULT_FOCUS_Y = 50;

type ImageFocus = {
  cleanUrl: string;
  focusX: number;
  focusY: number;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const parseFocusFromHash = (hash: string): { focusX: number; focusY: number } => {
  const cleaned = hash.replace(/^#/, '').trim();
  if (!cleaned) return { focusX: DEFAULT_FOCUS_X, focusY: DEFAULT_FOCUS_Y };

  const parts = cleaned.split('&');
  const fpPart = parts.find((part) => part.startsWith('fp='));
  if (!fpPart) return { focusX: DEFAULT_FOCUS_X, focusY: DEFAULT_FOCUS_Y };

  const values = fpPart.replace('fp=', '').split(',');
  if (values.length !== 2) return { focusX: DEFAULT_FOCUS_X, focusY: DEFAULT_FOCUS_Y };

  const x = Number(values[0]);
  const y = Number(values[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { focusX: DEFAULT_FOCUS_X, focusY: DEFAULT_FOCUS_Y };
  }

  return { focusX: clampPercent(x), focusY: clampPercent(y) };
};

const removeFocusFromHash = (hash: string): string => {
  const cleaned = hash.replace(/^#/, '').trim();
  if (!cleaned) return '';

  const rest = cleaned
    .split('&')
    .filter((part) => part && !part.startsWith('fp='));

  return rest.length > 0 ? `#${rest.join('&')}` : '';
};

export const parseImageFocus = (url: string | null | undefined): ImageFocus => {
  const raw = (url || '').trim();
  if (!raw) {
    return { cleanUrl: '', focusX: DEFAULT_FOCUS_X, focusY: DEFAULT_FOCUS_Y };
  }

  try {
    const parsed = new URL(raw);
    const { focusX, focusY } = parseFocusFromHash(parsed.hash);
    parsed.hash = removeFocusFromHash(parsed.hash);
    return { cleanUrl: parsed.toString(), focusX, focusY };
  } catch {
    const [base, hash = ''] = raw.split('#');
    const { focusX, focusY } = parseFocusFromHash(`#${hash}`);
    return { cleanUrl: base, focusX, focusY };
  }
};

export const withImageFocus = (
  url: string | null | undefined,
  focusX: number,
  focusY: number
) => {
  const clean = (url || '').trim();
  if (!clean) return '';

  const safeX = clampPercent(focusX);
  const safeY = clampPercent(focusY);

  try {
    const parsed = new URL(clean);
    const existing = removeFocusFromHash(parsed.hash).replace(/^#/, '');
    const focusParam = `fp=${safeX},${safeY}`;
    parsed.hash = existing ? `#${focusParam}&${existing}` : `#${focusParam}`;
    return parsed.toString();
  } catch {
    const [base, hash = ''] = clean.split('#');
    const existing = removeFocusFromHash(`#${hash}`).replace(/^#/, '');
    const focusParam = `fp=${safeX},${safeY}`;
    return existing ? `${base}#${focusParam}&${existing}` : `${base}#${focusParam}`;
  }
};
