import { User } from '../domain/model/user.entity.js';

export const UserAssembler = {
  toEntity(resource) {
    return new User({
      id: resource.id,
      name: resource.name,
      email: resource.email,
      status: resource.status,
      roles: resource.roles || [],
      permissions: resource.permissions || [],
    });
  },
};
