export const parseDateTime = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/, '$1T$2');
  const localDateTime = /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? `${normalized}T00:00:00` : normalized;
  const date = new Date(localDateTime);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value, locale = 'es') => {
  const date = parseDateTime(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-PE' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
};

export const isMonitoringStale = (value, now = new Date()) => {
  const date = parseDateTime(value);
  if (!date) return true;
  const age = now.getTime() - date.getTime();
  return age < -5 * 60 * 1000 || age > 24 * 60 * 60 * 1000;
};

export const formatAge = (value, now = new Date(), locale = 'es') => {
  const date = parseDateTime(value);
  if (!date) return null;
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60000));
  const formatter = new Intl.RelativeTimeFormat(locale === 'es' ? 'es-PE' : 'en-US', { numeric: 'always' });
  if (minutes < 60) return formatter.format(-minutes, 'minute');
  if (minutes < 1440) return formatter.format(-Math.floor(minutes / 60), 'hour');
  return formatter.format(-Math.floor(minutes / 1440), 'day');
};
