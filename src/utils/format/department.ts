import { AnyDepartment } from '@ts/api';

/**
 * Get a comma-separated string of department names from an array of departments.
 *
 * ## Usage
 * ```js
 * const departments = [
 *   { name: 'Alpes Maritimes', ... },
 *   { name: 'Var', ... },
 *   { name: 'Haute-Savoie', ... },
 * ];
 *
 * const departmentNames = Format.departmentNameList(departments);
 *
 * console.log(departmentNames); // 'Alpes Maritimes, Var, Haute-Savoie'
 * ```
 */
export function departmentNameList(departments: AnyDepartment[]): string {
  return departments.map((sch) => sch.name).join(', ');
}
