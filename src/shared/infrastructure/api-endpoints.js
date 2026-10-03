const defaultApiBaseUrl = 'http://localhost:3000/';

export const normalizeApiBaseUrl = (rawBaseUrl) => {
  const baseUrl = rawBaseUrl || defaultApiBaseUrl;
  return `${baseUrl.replace(/\/+$/, '')}/`;
};

export const platformApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

const defaultMinimarketId = import.meta.env.VITE_MINIMARKET_ID || 'minimarket-demo';

const minimarketEndpoint = (resource) => `api/v1/minimarkets/${defaultMinimarketId}/${resource}`;
const supplierEndpoint = (resource) => `api/v1/suppliers/sup-2/${resource}`;

export const apiEndpoints = Object.freeze({
  health: 'api/v1/health',
  auth: 'api/v1/auth',
  users: minimarketEndpoint('users'),
  profiles: 'api/v1/profiles',
  dashboard: minimarketEndpoint('dashboard'),
  supplierDashboard: supplierEndpoint('dashboard'),
  analytics: minimarketEndpoint('analytics'),
  supplierAnalytics: supplierEndpoint('analytics'),
  products: 'api/v1/products',
  sales: minimarketEndpoint('sales'),
  supplierProducts: supplierEndpoint('products'),
  inventory: minimarketEndpoint('inventory'),
  supplierInventory: supplierEndpoint('inventory'),
  inventorySearch: minimarketEndpoint('inventory/search'),
  lots: minimarketEndpoint('lots'),
  expirations: minimarketEndpoint('expirations'),
  requisitions: minimarketEndpoint('requisitions'),
  procurements: minimarketEndpoint('purchase-orders'),
  suppliers: 'api/v1/suppliers',
  conservationMonitoring: minimarketEndpoint('conservation/monitoring'),
  supplierConservationMonitoring: supplierEndpoint('conservation/monitoring'),
  conservationAlerts: minimarketEndpoint('communication/alerts'),
  notifications: minimarketEndpoint('communication/messages'),
  supplierAlerts: supplierEndpoint('communication/alerts'),
  activityHistory: minimarketEndpoint('activity-history'),
  waste: minimarketEndpoint('waste'),
  supplierWaste: supplierEndpoint('waste'),
  donations: minimarketEndpoint('donations'),
});
