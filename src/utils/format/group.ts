import { Group, GroupPreload, User } from '@ts/types';

/**
 * Get a string for the shortest name of a group.
 */
export function groupName(group?: Group | GroupPreload | null): string {
  const { name, displayName, shortName } = group || {};

  return displayName || shortName || name || 'Groupe inconnu';
}
