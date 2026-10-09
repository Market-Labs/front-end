import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdministrator, permissionsForRole } from './access-role.js';

test('administrator can manage users and perform organization operations', () => {
  assert.deepEqual(permissionsForRole('admin', 'administrator'), [
    'inventory:write', 'procurements:approve', 'users:manage',
  ]);
  assert.deepEqual(permissionsForRole('supplier', 'administrator'), [
    'products:write', 'procurements:track', 'users:manage',
  ]);
  assert.equal(isAdministrator('owner'), true);
});

test('collaborator keeps operational permissions but cannot manage users', () => {
  assert.deepEqual(permissionsForRole('admin', 'collaborator'), [
    'inventory:write', 'procurements:approve',
  ]);
  assert.deepEqual(permissionsForRole('supplier', 'collaborator'), [
    'products:write', 'procurements:track',
  ]);
  assert.equal(isAdministrator('collaborator'), false);
});
