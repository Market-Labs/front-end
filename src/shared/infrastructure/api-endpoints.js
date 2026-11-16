import { apiUser } from './api-session.js';

export const normalizeApiBaseUrl = (url) => `${(url || 'http://localhost:5262/').replace(/\/+$/, '')}/`;
export const platformApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

const scoped = (resource, accountType = apiUser()?.accountType) => {
  const organizationId = apiUser()?.organizationId;
  if (!organizationId || !['minimarket', 'supplier'].includes(accountType)) throw new Error('missing-organization');
  return `api/v1/${accountType === 'supplier' ? 'suppliers' : 'minimarkets'}/${organizationId}/${resource}`;
};

export const apiEndpoints = Object.freeze({
  health: 'api/v1/health',
  auth: 'api/v1/auth',
  users: 'api/v1/users',
  profiles: 'api/v1/profiles',
  get clients() { return scoped('clients', 'supplier'); },
  get dashboard() { return scoped('dashboard'); },
  get supplierDashboard() { return scoped('dashboard', 'supplier'); },
  get analytics() { return scoped('analytics'); },
  get supplierAnalytics() { return scoped('analytics', 'supplier'); },
  products: 'api/v1/products',
  get supplierProducts() { return scoped('products', 'supplier'); },
  get inventory() { return scoped('inventory'); },
  get supplierInventory() { return scoped('inventory', 'supplier'); },
  get inventorySearch() { return scoped('inventory/search'); },
  get lots() { return scoped('lots'); },
  get expirations() { return scoped('expirations'); },
  get requisitions() { return scoped('requisitions'); },
  get procurements() { return scoped('purchase-orders'); },
  suppliers: 'api/v1/suppliers',
  get conservationMonitoring() { return scoped('conservation/monitoring'); },
  get supplierConservationMonitoring() { return scoped('conservation/monitoring', 'supplier'); },
  get conservationAlerts() { return scoped('communication/alerts'); },
  get notifications() { return scoped('communication/messages'); },
  get supplierAlerts() { return scoped('communication/alerts', 'supplier'); },
  get waste() { return scoped('waste'); },
  get supplierWaste() { return scoped('waste', 'supplier'); },
  get donations() { return scoped('donations'); },
});
