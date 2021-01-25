import { batch } from 'react-redux';

import Store from '@redux/store';
import {
  UPDATE_PLACES_DATA,
  UPDATE_PLACES_SEARCH,
  UPDATE_PLACES_STATE,
  UPDATE_PLACES_ITEM,
  CLEAR_PLACES,
  UPDATE_PLACES_MAP_DATA,
} from '@ts/redux';
import { MapLocation, Place, School, Event } from '@ts/types';
import { Format, request } from '@utils';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: Place[]) => data.sort((a, b) => a.name.localeCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques places depuis le serveur
 * @param next Si il faut récupérer les places après le dernier
 */
async function updatePlaces(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_PLACES_DATA,
      stateUpdate: UPDATE_PLACES_STATE,
      url: 'places/list',
      listName: 'data',
      sort: nameAscSort,
      dataType: 'places',
      type,
      params,
    }),
  );
}

async function searchPlaces(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_PLACES_SEARCH,
      stateUpdate: UPDATE_PLACES_STATE,
      url: 'places/list',
      dataType: 'places',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
      listName: 'search',
      clear: type !== 'next',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul place
 * @param placeId L'id de l'place à récuperer
 */
async function fetchPlace(placeId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_PLACES_ITEM,
      stateUpdate: UPDATE_PLACES_STATE,
      stateName: 'info',
      url: 'places/list',
      dataType: 'places',
      params: { placeId },
    }),
  );
}

/**
 * @docs actions
 * Cherche tout les lieux de la carte dans une certaine zone
 * @param bounds Bornes dans lesquelles il faut chercher
 * @param zoom Niveau de zoom (doit être un integer)
 */
async function fetchMapLocations(
  eastLng: number,
  northLat: number,
  westLng: number,
  southLat: number,
  zoom: number,
): Promise<MapLocation.Element[]> {
  const result = await request('maps/clusters', 'get', {
    westLng,
    eastLng,
    southLat,
    northLat,
    zoom,
  });

  if (result.data) {
    // Move dataType to properties
    return result.data.points.map(({ dataType, ...point }: any) => {
      const extraProperties: { [key: string]: any } = {};
      // Handle null cases
      if (dataType === 'school' && typeof point.properties.events !== 'number') {
        extraProperties.events = 0;
      }
      if (dataType === 'school' && typeof point.properties.active !== 'boolean') {
        extraProperties.active = true;
      }
      return {
        ...point,
        properties: { ...point.properties, ...extraProperties, dataType },
      };
    });
  }

  throw new Error('Data does not exist on result of maps/clusters');
}

async function updateMapLocations(type: MapLocation.PointDataType, id: string) {
  await Store.dispatch(async (dispatch, getState) => {
    dispatch({
      type: UPDATE_PLACES_STATE,
      data: {
        map: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });

    let newLocation: MapLocation.FullLocation | null = null;

    try {
      if (type === 'school') {
        const result = await request('schools/info', 'get', { schoolId: id });

        const schools = result.data?.schools;
        if (result.data && Array.isArray(schools) && schools.length > 0) {
          const school = schools[0] as School;
          newLocation = {
            type: 'school',
            id: school._id,
            name: school.name,
            shortName: school.shortName,
            icon: 'school',
            addresses: [Format.address(school.address)],
            description: school.description.data,
            detail: Format.schoolTypes(school.types),
          };
        }
      }

      if (type === 'event') {
        const result = await request('events/info', 'get', { eventId: id });

        const events = result.data?.events;
        if (result.data && Array.isArray(events) && events.length > 0) {
          const event = events[0] as Event;
          newLocation = {
            type: 'event',
            id: event._id,
            name: event.title,
            icon: 'calendar-outline',
            addresses: event.places.map((p) => {
              if (p.type === 'standalone') {
                return Format.address(p.address);
              }
              // Si le serveur envoie les bonnes données, on devrait jamais
              // atteindre ce cas
              return 'Évènement attaché à un lieu ou une école';
            }),
            description: event.summary,
            detail: Format.shortEventDate(event.duration),
          };
        }
      }

      if (type === 'place') {
        const result = await request('places/info', 'get', { placeId: id });

        const places = result.data?.places;
        if (result.data && Array.isArray(places) && places.length > 0) {
          const place = places[0] as Place;
          newLocation = {
            type: 'place',
            id: place._id,
            name: place.name,
            icon: 'map-marker-outline',
            addresses: [Format.address(place.address)],
            description: place.summary,
            detail: Format.placeTypes(place.types),
          };
        }
      }
    } catch (e) {
      dispatch({
        type: UPDATE_PLACES_STATE,
        data: {
          map: {
            loading: false,
            success: false,
            error: true,
          },
        },
      });
    }

    if (newLocation) {
      batch(() => {
        dispatch({
          type: UPDATE_PLACES_MAP_DATA,
          data: [...getState().places.mapData, newLocation],
        });
        dispatch({
          type: UPDATE_PLACES_STATE,
          data: {
            map: {
              loading: false,
              success: true,
              error: false,
            },
          },
        });
      });
    } else {
      dispatch({
        type: UPDATE_PLACES_STATE,
        data: {
          map: {
            loading: false,
            success: false,
            error: true,
          },
        },
      });
    }
  });
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearPlaces(data = true, search = true) {
  Store.dispatch(clearCreator({ clear: CLEAR_PLACES, data, search }));
}

export {
  updatePlaces,
  clearPlaces,
  fetchPlace,
  searchPlaces,
  fetchMapLocations,
  updateMapLocations,
};
