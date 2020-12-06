// Named tuples = array of fixed length and typescript allows you to comment what each are

import { Account, AccountPermission, GroupRolePermission } from '@ts/types';

export function checkPermission(
  account: Account,
  permission: GroupRolePermission,
  group?: string,
): boolean {
  if (!account.loggedIn) return false;
  return account.permissions.some(
    (accountPermission) =>
      accountPermission.permission === permission.permission &&
      (!group || accountPermission.group === group) &&
      (((permission.scope.groups || []).every(
        (g) =>
          accountPermission.scope.groups?.includes(g) ||
          (accountPermission.group === g && accountPermission.scope.self),
      ) &&
        (permission.scope.schools || []).every((s) =>
          accountPermission.scope.schools?.includes(s),
        ) &&
        (permission.scope.departments || [])?.every((d) =>
          accountPermission.scope.departments?.includes(d),
        ) &&
        (!permission.scope.global || accountPermission.scope.global) &&
        (!permission.scope.everywhere || accountPermission.scope.everywhere)) ||
        accountPermission.scope.everywhere),
  );
}

export function getPermissionGroups(
  account: Account,
  permission: GroupRolePermission['permission'],
) {
  if (!account.loggedIn) return [];
  return account.permissions.reduce((groups: string[], p: AccountPermission) => {
    if (p.permission === permission) {
      return [...groups, ...(p.scope.self ? [p.group] : []), ...(p.scope.groups || [])];
    } else {
      return groups;
    }
  }, []);
}
