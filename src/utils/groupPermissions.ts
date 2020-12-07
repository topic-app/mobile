// Named tuples = array of fixed length and typescript allows you to comment what each are

import { Account } from '@ts/types';

export function accountHasPermissions(
  account: Account,
  permissions: (string | [PermissionName: string, PermissionGroup: string])[],
): boolean {
  // Check if any permissions in account match the permissions to search for
  return account.permissions.some((accountPermission) => {
    // For each account permission, check if it matches something in permissions array
    return permissions.some((permission) => {
      if (Array.isArray(permission)) {
        const [name, group] = permission;
        return (
          (accountPermission.permission === name && !group) ||
          (accountPermission.permission === name && accountPermission.group === group)
        );
      }
      return accountPermission.permission === permission;
    });
  });
}
