import { User } from '../domain/model/user.entity.js';
import { permissionsForRole } from '../domain/model/access-role.js';

export const UserAssembler = {
  toEntity(resource) {
    return new User({
      id: resource.id,
      name: resource.name,
      email: resource.email,
      status: resource.status,
      roles: resource.accountType === 'supplier' ? ['Proveedor Organico'] : ['Administrador de Minimarket'],
      permissions: permissionsForRole(resource.accountType, resource.accessLevel || 'owner'),
      supplierId: resource.supplierId || null,
      minimarketId: resource.minimarketId || null,
      createdBy: resource.createdBy || null,
      tenantId: resource.tenantId || null,
      accessLevel: resource.accessLevel || 'owner',
      organizationId: resource.organizationId,
      organizationName: resource.organizationName,
      accountType: resource.accountType,
    });
  },
};
