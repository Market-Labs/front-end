export class User {
  constructor({
    id,
    name,
    email,
    status = 'active',
    roles = [],
    permissions = [],
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.status = status;
    this.roles = roles;
    this.permissions = permissions;
  }

  get initials() {
    return this.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}
