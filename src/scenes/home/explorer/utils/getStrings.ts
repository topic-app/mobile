import { MapLocation } from '@ts/types';

import { MapMarkerDataType } from '../views/Map';

/**
 * Obtient les strings correspondants pour chaque type de données
 */
export function getStrings(
  mapMarkerData: MapMarkerDataType,
  place?: MapLocation.FullLocation,
): MapLocation.FullLocation {
  if (place) return place;
  const { id, name, type } = mapMarkerData;

  const icon =
    type === 'event'
      ? 'calendar-outline'
      : type === 'place'
      ? 'map-marker-outline'
      : type === 'school'
      ? 'school'
      : 'map-marker-question-outline';

  return {
    id,
    name,
    type,
    addresses: [],
    description: 'Chargement...',
    detail: '',
    icon,
  };
}
