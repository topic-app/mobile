import { User } from '@ts/types';

/**
 * Get a string for the most complete name for a given user.
 * Note: make sure you respect the user's privacy when displaying their
 *       firstname and lastname
 *
 * ## Exemple
 * ```js
 * const bob = {
 *   data: {
 *     firstName: 'Bob',
 *     lastName: 'Sheffield',
 *   },
 *   // ...
 * };
 *
 * const fullName = Format.getShortEventDate(bob);
 *
 * console.log(bob); // 'Bob Sheffield'
 * ```
 */
export function fullUserName(user: User): string {
  const { name, displayName, data, info } = user;

  // 1. Try firstname and lastname
  const { firstName, lastName } = data;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  // 2. Use displayName or name
  if (name || displayName) {
    return name || displayName;
  }

  // 3. Use username
  const { username } = info;
  if (username) {
    return username;
  }

  return 'Utilisateur Inconnu';
}
