import { expiringLots } from '../../../inventory/domain/model/expiration-policy.js';

export const operationalAlerts = (inventory, monitoring, translate, now = new Date()) => [
  ...expiringLots(inventory, now).map((item) => ({
    id: `generated-expiration-${item.id}`,
    subject: translate('page.alerts.expirationTitle'),
    body: translate(item.daysUntilExpiration < 0 ? 'page.alerts.expiredBody' : 'page.alerts.expiringBody', {
      product: item.productName, lot: item.lotCode, days: item.daysUntilExpiration,
    }),
  })),
  ...inventory.filter((item) => Number(item.stock) <= Number(item.minimumStock)).map((item) => ({
    id: `generated-stock-${item.id}`,
    subject: translate('page.alerts.lowStockTitle'),
    body: translate('page.alerts.lowStockBody', { product: item.productName, lot: item.lotCode }),
  })),
  ...monitoring.filter((record) => record.status === 'risk').map((record) => ({
    id: `generated-conservation-${record.id}`,
    subject: translate('page.alerts.conservationTitle'),
    body: translate('page.alerts.conservationBody', { zone: record.zone, product: record.productName }),
  })),
].map((alert) => ({ ...alert, sender: 'Sistema MarketGo', read: false, starred: false, sentAt: now.toLocaleString() }));
