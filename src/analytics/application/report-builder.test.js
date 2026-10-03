import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReport } from './report-builder.js';

const sources = {
  products: [{ id: 'VGT-00001', name: 'Tomate', category: 'Vegetales', supplierId: 'sup-2' }],
  inventory: [{ id: 'inv-1', productName: 'Tomate', stock: 5, minimumStock: 2, lotCode: 'L-1', expirationDate: '2026-10-10', status: 'healthy' }],
  orders: [
    { id: 'ship-1', minimarketId: 'min-1', supplierId: 'sup-2', supplier: 'Anita', minimarket: 'Market', status: 'received', total: 12, receivedAt: '2026-10-01', items: [{ productName: 'Tomate', quantity: 3, unitPrice: 4 }] },
    { id: 'ship-2', minimarketId: 'min-1', supplierId: 'sup-1', supplier: 'Other', minimarket: 'Market', status: 'received', total: 4, receivedAt: '2026-10-01', items: [{ productName: 'Tomate', quantity: 1, unitPrice: 4 }] },
  ],
  waste: [{ id: 'w-1', ownerId: 'min-1', productName: 'Tomate', lotCode: 'L-1', quantity: 2, reason: 'expiration', recordedAt: '2026-10-01' }],
  conservation: [{ id: 'c-1', zone: 'Cool', productName: 'Tomate', temperature: 4, humidity: 60, recordedAt: '2026-10-01', status: 'healthy' }],
  suppliers: [{ id: 'sup-2', businessName: 'Anita', ruc: '123', specialty: 'Vegetales', coverageArea: 'Arequipa' }],
  sales: [{ id: 'sale-1', minimarketId: 'min-1', occurredAt: '2026-10-01', customer: 'Counter', discount: 1, items: [{ productName: 'Tomate', quantity: 2, unitPrice: 4 }] }],
};
const t = (key) => key;

test('all six reports produce rows with aligned columns', () => {
  for (const type of ['Inventario', 'Abastecimiento', 'Mermas', 'Conservacion', 'Proveedores', 'Ventas']) {
    const report = buildReport(type, sources, false, t);
    assert.ok(report.rows.length > 0, type);
    for (const row of report.rows) assert.deepEqual(Object.keys(row), report.columns.map((column) => column.key));
  }
});

test('supplier sales come only from their received shipments', () => {
  const report = buildReport('Ventas', sources, true, t);
  assert.equal(report.rows.length, 1);
  assert.equal(report.rows[0].id, 'sale-ship-1');
  assert.equal(report.rows[0].total, 12);
});

test('minimarket sales come from retail records and include discount', () => {
  const report = buildReport('Ventas', sources, false, t);
  assert.equal(report.rows.length, 1);
  assert.equal(report.rows[0].total, 7);
});
