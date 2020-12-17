import _ from 'lodash';

import { Address, DepartmentPreload, PlaceType } from '@ts/types';

/**
 * Get a long address string from an address object
 *
 * ## Usage
 * ```js
 * const place = {
 *   address: {
 *     shortName: 'PIA',
 *     address: {
 *       number: '4',
 *       street: 'rue des mouches',
 *       city: 'Terre-Neuve',
 *       extra: 'Apartement B',
 *       code: '01360',
 *     },
 *     // ...
 *   },
 *   // ...
 * };
 *
 * const address = Format.address(place.address);
 *
 * console.log(address); // '4 rue des mouches, 01360 Terre-Neuve (Apartement B)'
 * ```
 */
export function address({ shortName, address: addr, geo, departments }: Address): string {
  // If we have at least a street and a city, then use complete address
  if (addr.street && addr.city) {
    const { number, street, city, extra, code } = addr;
    if (number && street && city && code && extra) {
      return `${number} ${street}, ${code} ${city} (${extra})`;
    }
    if (number && street && city && code) {
      return `${number} ${street}, ${code} ${city}`;
    }
    if (number && street && city) {
      return `${number} ${street}, ${city}`;
    }
    if (street && city) {
      return `${street}, ${city}`;
    }
  }

  // If we have gps coordinates, then use them
  if (
    Array.isArray(geo.coordinates) &&
    geo.coordinates.length === 2 &&
    geo.coordinates[0] &&
    geo.coordinates[1]
  ) {
    return geo.coordinates.join(', ');
  }

  // Otherwise, use the department?
  if (Array.isArray(departments) && departments.length !== 0) {
    const departmentName = departments[0].displayName;
    if (shortName) {
      return `${shortName}, ${departmentName}`;
    }
    return departmentName;
  }

  return 'Addresse non reconnue';
}

/**
 * Get a short address string from an address object
 *
 * ## Usage
 * ```js
 * const place = {
 *   address: {
 *     shortName: 'PIA',
 *     address: {
 *       number: '4',
 *       street: 'rue des mouches',
 *       city: 'Terre-Neuve',
 *       extra: 'Apartement B',
 *       code: '01360',
 *     },
 *     departments: [
 *       { name: 'Hautes-Alpes', type: 'departement' },
 *     ],
 *   },
 *   // ...
 * };
 *
 * const address = Format.shortAddress(place.address);
 *
 * console.log(address); // 'Terre-Neuve, Hautes-Alpes'
 * ```
 */
export function shortAddress(addr: Address, departments?: DepartmentPreload[]): string | undefined {
  const deps = addr.departments;
  if (departments) deps.push(...departments);

  const department = deps.find((dep) => dep.type === 'departement');

  if (addr.address.city && department) {
    return `${addr.address.city}, ${department.name}`;
  }
}

/**
 * Get a string representing the place's type(s).
 *
 * ## Usage
 * ```js
 * const place = {
 *   name: "Musée National de l'Art Contemporain",
 *   types: ['cultural', 'tourism'];
 *   // ...
 * };
 *
 * const place = Format.schoolTypes(school.types);
 *
 * console.log(types); // 'Lieu culturel et touristique'
 * ```
 */
export function placeTypes(types: PlaceType[]): string {
  const sortedTypes = ['club', 'cultural', 'history', 'tourism', 'other'];
  const mappedTypes = {
    club: 'club',
    cultural: 'culturel',
    history: 'historique',
    tourism: 'touristique',
    other: 'autre',
  };
  const newTypes = types
    .sort((a, b) => sortedTypes.indexOf(a) - sortedTypes.indexOf(b))
    .map((type, index) => {
      let mappedType = mappedTypes[type];
      if (types.includes('club')) {
        if (index === 1) {
          mappedType = `lieu ${mappedType}`;
        }
      } else if (index === 0) {
        mappedType = `lieu ${mappedType}`;
      }
      return mappedType;
    });

  if (newTypes.length === 0) {
    return '';
  }
  if (newTypes.length === 1) {
    return _.capitalize(newTypes[0]);
  }
  const lastType = newTypes.pop();
  return _.capitalize(`${newTypes.join(', ')} et ${lastType}`);
}
