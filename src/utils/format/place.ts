import _ from 'lodash';

import { Address, PlaceType } from '@ts/types';

/**
 * Obtient une adresse courte d'un endroit
 */
export function shortAddress({ shortName, address, geo, departments }: Address): string {
  // Si on a au moins une rue et une ville, utiliser l'addresse complete
  if (address.street && address.city) {
    const { number, street, city, extra, code } = address;
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

  // Si on a des coordonnées GPS, utiliser celles-ci
  if (Array.isArray(geo.coordinates) && geo.coordinates.length === 2) {
    return geo.coordinates.join(', ');
  }

  // Sinon, euh... Utiliser le departement?
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
 * Get a string representing the place's type(s).
 *
 * ## Exemple
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
