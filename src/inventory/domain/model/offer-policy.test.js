import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileOffers } from './offer-policy.js';

test('reduces active offer quantities when stock leaves the lot', () => {
  const offers = [
    { id: 'a', status: 'active', quantity: 3, endDate: '2026-10-20' },
    { id: 'b', status: 'active', quantity: 4, endDate: '2026-10-20' },
  ];
  const updated = reconcileOffers(offers, 2, '2026-10-09');
  assert.deepEqual(updated.map((offer) => [offer.quantity, offer.status]), [[2, 'active'], [0, 'exhausted']]);
  assert.equal(offers[0].quantity, 3);
});
