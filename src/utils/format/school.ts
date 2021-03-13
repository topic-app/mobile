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
 * console.log(types); // 'Collège, lycée et CPGE'
 * ```
 */
export function schoolTypes(types: SchoolType[]): string {
  const sortedTypes = ['college', 'lycee', 'prepa', 'other'];
  const mappedTypes = {
    college: 'collège',
    lycee: 'lycée',
    prepa: 'CPGE',
    other: 'autre',
  };
  const newTypes = types
    .sort((a, b) => sortedTypes.indexOf(a) - sortedTypes.indexOf(b))
    .map((type) => mappedTypes[type]);

  if (newTypes.length === 0) {
    return '';
  }
  if (newTypes.length === 1) {
    return newTypes[0].charAt(0).toUpperCase() + newTypes[0].slice(1);
  }
  const lastType = newTypes.pop();
  const str = `${newTypes.join(', ')} et ${lastType}`;
  return str.charAt(0).toUpperCase() + str.slice(1);
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
