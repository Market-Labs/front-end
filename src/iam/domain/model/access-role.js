export const isAdministrator = (accessLevel) => ['owner', 'administrator'].includes(accessLevel);

export const permissionsForRole = (organizationRole, accessLevel) => {
  const permissions = organizationRole === 'supplier'
    ? ['products:write', 'procurements:track']
    : ['inventory:write', 'procurements:approve'];
  if (isAdministrator(accessLevel)) permissions.push('users:manage');
  return permissions;
};
