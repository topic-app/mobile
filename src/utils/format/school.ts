import _ from 'lodash';

import { AnySchool, SchoolType } from '@ts/types';

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

/**
 * Get a comma-separated string of school names from an array of schools.
 *
 * ## Usage
 * ```js
 * const schools = [
 *   { name: 'Ecole des Arts', ... },
 *   { name: 'Ecole des Ingénieurs', ... },
 *   { name: 'Ecole des Agriculteurs', ... },
 * ];
 *
 * const schoolNames = Format.schoolNameList(schools);
 *
 * console.log(schoolNames); // 'Ecole des Arts, Ecole des Ingénieurs, Ecole des Agriculteurs'
 * ```
 */
export function schoolNameList(schools: AnySchool[]): string {
  return schools.map((sch) => sch.name).join(', ');
}
