import test from 'node:test';
import assert from 'node:assert/strict';
import { operationalAlerts } from './operational-alerts.js';

test('derives expiration, low-stock and conservation alerts from live records', () => {
  const translate = (key) => key;
  const alerts = operationalAlerts(
    [{ id: 'inv-1', productName: 'Tomate', lotCode: 'LOT-1', stock: 2, minimumStock: 3, expirationDate: '2026-10-11' }],
    [{ id: 'con-1', zone: 'Anaquel', productName: 'Tomate', status: 'risk' }],
    translate,
    new Date(2026, 9, 9),
  );
  assert.deepEqual(alerts.map((alert) => alert.id), [
    'generated-expiration-inv-1', 'generated-stock-inv-1', 'generated-conservation-con-1',
  ]);
});
