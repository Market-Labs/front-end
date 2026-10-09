import test from 'node:test';
import assert from 'node:assert/strict';
import { daysUntilExpiration, expiringLots } from './expiration-policy.js';

test('calculates calendar days and rejects invalid dates', () => {
  const now = new Date(2026, 9, 9);
  assert.equal(daysUntilExpiration('2026-10-09', now), 0);
  assert.equal(daysUntilExpiration('2026-10-14', now), 5);
  assert.equal(daysUntilExpiration('2026-10-08', now), -1);
  assert.equal(daysUntilExpiration('2026-02-30', now), null);
});

test('returns only stocked lots near expiration, sorted by urgency', () => {
  const items = [
    { id: 'later', stock: 1, expirationDate: '2026-10-20' },
    { id: 'soon', stock: 3, expirationDate: '2026-10-11' },
    { id: 'expired', stock: 2, expirationDate: '2026-10-08' },
    { id: 'empty', stock: 0, expirationDate: '2026-10-09' },
  ];
  assert.deepEqual(expiringLots(items, new Date(2026, 9, 9)).map((item) => item.id), ['expired', 'soon']);
});
