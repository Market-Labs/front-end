const DAY_MS = 24 * 60 * 60 * 1000;

export const daysUntilExpiration = (expirationDate, now = new Date()) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expirationDate || '')) return null;
  const expires = Date.parse(`${expirationDate}T00:00:00Z`);
  if (!Number.isFinite(expires) || new Date(expires).toISOString().slice(0, 10) !== expirationDate) return null;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((expires - today) / DAY_MS);
};

export const expiringLots = (items, now = new Date(), thresholdDays = 5) => items
  .filter((item) => Number(item.stock) > 0)
  .map((item) => ({ ...item, daysUntilExpiration: daysUntilExpiration(item.expirationDate, now) }))
  .filter((item) => item.daysUntilExpiration !== null && item.daysUntilExpiration <= thresholdDays)
  .sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
