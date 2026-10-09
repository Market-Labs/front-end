import test from 'node:test';
import assert from 'node:assert/strict';
import { nextSupplierId } from './supplier-id.js';

test('continues the numeric supplier sequence', () => {
  assert.equal(nextSupplierId([{ id: 'sup-1' }, { id: 'sup-2' }]), 'sup-3');
});

test('ignores legacy UUID identifiers and inactive suppliers still reserve their number', () => {
  assert.equal(nextSupplierId([
    { id: 'sup-1' },
    { id: 'sup-4', status: 'inactive' },
    { id: 'sup-f8a432da-dada-4871-830a-37546065890b' },
  ]), 'sup-5');
});
