const defaultApiBaseUrl = 'http://localhost:3000/';

export const normalizeApiBaseUrl = (rawBaseUrl) => {
  const baseUrl = rawBaseUrl || defaultApiBaseUrl;
  return `${baseUrl.replace(/\/+$/, '')}/`;
};

export const platformApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const apiEndpoints = Object.freeze({
  health: 'api/v1/health',
  auth: 'api/v1/auth',
  users: 'api/v1/users',
  profiles: 'api/v1/profiles',
  dashboard: 'api/v1/dashboard',
  analytics: 'api/v1/analytics',
  products: 'api/v1/products',
  inventory: 'api/v1/inventory',
  inventorySearch: 'api/v1/inventory/search',
  lots: 'api/v1/lots',
  expirations: 'api/v1/expirations',
  requisitions: 'api/v1/requisitions',
  procurements: 'api/v1/orders',
  suppliers: 'api/v1/suppliers',
  conservationMonitoring: 'api/v1/conservation/monitoring',
  conservationAlerts: 'api/v1/conservation/alerts',
  notifications: 'api/v1/notifications',
  activityHistory: 'api/v1/activity-history',
  waste: 'api/v1/waste',
  donations: 'api/v1/donations',
});
