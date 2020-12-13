import _ from 'lodash';

import { ExplorerLocation } from '@ts/types';
import { Format } from '@utils/index';

import { MapMarkerDataType } from '../views/Map';

type LocationStrings = {
  icon: string;
  title: string;
  subtitle?: string;
  description: string;
  addresses: string[];
  detail?: string;
};

function formatTypes<T extends string>(
  types: T[],
  sortedTypes: T[],
  typeMap: { [K in T]: string },
): string {
  // Re-orginize array: e.g. college → lycee → prepa → autre

  const newTypes = types
    .sort((a, b) => sortedTypes.indexOf(a) - sortedTypes.indexOf(b))
    .map((type) => typeMap[type]);

  if (newTypes.length === 0) {
    return '';
  }
  if (newTypes.length === 1) {
    return _.capitalize(newTypes[0]);
  }
  const lastType = newTypes.pop();
  return _.capitalize(`${newTypes.join(', ')} et ${lastType}`);
}

const EVENT_ICON = 'calendar-outline';
const PLACE_ICON = 'map-marker-outline';
const SCHOOL_ICON = 'school';
const SECRET_ICON = 'egg-easter';

/**
 * Obtient les strings correspondants pour chaque type de données
 */
export function getStrings(
  mapMarkerData: MapMarkerDataType,
  place?: ExplorerLocation.Marker,
): LocationStrings {
  const strings: LocationStrings = {
    icon: '',
    title: '',
    description: '',
    addresses: [],
  };

  if (!place) {
    const { type } = mapMarkerData;
    if (type === 'event') {
      strings.icon = EVENT_ICON;
    } else if (type === 'place') {
      strings.icon = PLACE_ICON;
    } else if (type === 'school') {
      strings.icon === SCHOOL_ICON;
    } else if (type === 'secret') {
      strings.icon === SECRET_ICON;
    } else {
      strings.icon = 'map-marker-question-outline';
    }
    strings.title = mapMarkerData.name;
    strings.description = 'Chargement...';
    return strings;
  }

  switch (place.type) {
    case 'event':
      strings.icon = 'calendar-outline';
      strings.title = place.data.title;
      strings.description = place.data.summary;
      strings.detail = Format.shortEventDate(place.data.duration);
      strings.addresses = place.data.places.map((p) => {
        if (p.type === 'standalone') {
          return Format.address(p.address);
        }
        // Si le serveur envoie les bonnes données, on devrait jamais
        // atteindre ce cas
        return 'Évènement attaché à un lieu ou une école';
      });
      break;
    case 'place':
      strings.icon = 'map-marker-outline';
      strings.title = place.data.name || place.data.displayName;
      strings.description = place.data.summary;
      strings.detail = Format.placeTypes(place.data.types);
      strings.addresses = [Format.address(place.data.address)];
      break;
    case 'school':
      strings.icon = 'school';
      strings.title = place.data.displayName ?? place.data.name;
      strings.subtitle = place.data.shortName;
      strings.detail = Format.schoolTypes(place.data.types);
      strings.addresses = [Format.address(place.data.address)];
      break;
    case 'secret':
      strings.icon = 'egg-easter';
      strings.title = place.data.name || place.data.displayName;
      strings.description = place.data.summary;
      strings.detail = Format.placeTypes(place.data.types);
      strings.addresses = [Format.address(place.data.address)];
  }

  return strings;
}
