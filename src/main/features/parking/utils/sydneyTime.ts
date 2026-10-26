const TIME_ZONE = 'Australia/Sydney';

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function sydneyDate(value: Date | number = Date.now()): string {
  const parts = dateFormatter.formatToParts(value instanceof Date ? value : new Date(value));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function sydneyDateDaysAgo(days: number, now = Date.now()): string {
  const [year, month, day] = sydneyDate(now).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day - days));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function formatSydneyTime(timeMs: number, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-AU', { timeZone: TIME_ZONE, ...options }).format(timeMs);
}
