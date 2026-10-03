import demoData from './demo-data.json';
import { apiEndpoints } from './api-endpoints.js';

const resources = new Map([
  [apiEndpoints.health, demoData.health],
  [apiEndpoints.users, demoData.users],
  [apiEndpoints.profiles, demoData.profiles],
  [apiEndpoints.dashboard, demoData.dashboard],
  [apiEndpoints.supplierDashboard, demoData.supplierDashboard],
  [apiEndpoints.analytics, demoData.analytics],
  [apiEndpoints.supplierAnalytics, demoData.supplierAnalytics],
  [apiEndpoints.products, demoData.products],
  [apiEndpoints.sales, demoData.retailSales],
  [apiEndpoints.inventory, demoData.inventory],
  [apiEndpoints.supplierInventory, demoData.supplierInventory],
  [apiEndpoints.inventorySearch, demoData.inventory],
  [apiEndpoints.lots, []],
  [apiEndpoints.expirations, []],
  [apiEndpoints.requisitions, demoData.requisitions],
  [apiEndpoints.procurements, demoData.purchaseOrders],
  [apiEndpoints.suppliers, demoData.suppliers],
  [apiEndpoints.conservationMonitoring, demoData.conservationMonitoring],
  [apiEndpoints.supplierConservationMonitoring, demoData.supplierConservationMonitoring],
  [apiEndpoints.conservationAlerts, demoData.conservationAlerts],
  [apiEndpoints.notifications, demoData.notifications],
  [apiEndpoints.supplierAlerts, demoData.supplierAlerts],
  [apiEndpoints.activityHistory, demoData.activityHistory],
  [apiEndpoints.waste, demoData.waste],
  [apiEndpoints.donations, []],
]);

const itemRoutes = [
  apiEndpoints.users,
  apiEndpoints.profiles,
  apiEndpoints.products,
  apiEndpoints.inventory,
  apiEndpoints.supplierInventory,
  apiEndpoints.requisitions,
  apiEndpoints.procurements,
  apiEndpoints.suppliers,
];

export const demoAdapter = async (config) => {
  if (config.method?.toLowerCase() !== 'get') throw new Error('demo-read-only');

  const path = config.url.replace(/^\/+/, '').split('?')[0];
  let data;

  if (path === apiEndpoints.supplierProducts) {
    data = demoData.products.filter((item) => item.supplierId === 'sup-2');
  } else if (path === apiEndpoints.supplierWaste) {
    data = demoData.waste.filter((item) => item.ownerId === 'sup-2');
  } else {
    data = resources.get(path);
  }

  if (data === undefined) {
    const collection = itemRoutes.find((route) => path.startsWith(`${route}/`));
    const id = collection && decodeURIComponent(path.slice(collection.length + 1));
    data = collection && resources.get(collection)?.find((item) => String(item.id) === id);
  }

  if (data === undefined) throw new Error(`Unknown demo endpoint: ${path}`);

  return { data: structuredClone(data), status: 200, statusText: 'OK', headers: {}, config };
};
