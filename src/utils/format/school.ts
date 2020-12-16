import _ from 'lodash';

import { SchoolType } from '@ts/types';

/**
 * Get a string representing the school's type(s).
 *
 * ## Usage
 * ```js
 * const school = {
 *   name: 'Ecole des Arts de Machin-sur-Seine',
 *   types: ['prepa', 'college', 'lycee'];
 *   // ...
 * };
 *
 * const types = Format.schoolTypes(school.types);
 *
 * console.log(types); // 'Collège, lycée et classes préparatoires'
 * ```
 */
export function schoolTypes(types: SchoolType[]): string {
  const sortedTypes = ['college', 'lycee', 'prepa', 'other'];
  const mappedTypes = {
    college: 'collège',
    lycee: 'lycée',
    prepa: 'classes préparatoires',
    other: 'autre',
  };
  const newTypes = types
    .sort((a, b) => sortedTypes.indexOf(a) - sortedTypes.indexOf(b))
    .map((type) => mappedTypes[type]);

  if (newTypes.length === 0) {
    return '';
  }
  if (newTypes.length === 1) {
    return _.capitalize(newTypes[0]);
  }
  const lastType = newTypes.pop();
  return _.capitalize(`${newTypes.join(', ')} et ${lastType}`);
}
