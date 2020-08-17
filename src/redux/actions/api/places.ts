import Store from '@redux/store';
import { Place } from '@ts/types';
import {
  UPDATE_PLACES_DATA,
  UPDATE_PLACES_SEARCH,
  UPDATE_PLACES_STATE,
  UPDATE_PLACES_ITEM,
  CLEAR_PLACES,
} from '@ts/redux';

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
      url: 'places/list',
      dataType: 'places',
      params: { placeId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearPlaces(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_PLACES, data, search }));
}

export { updatePlaces, clearPlaces, fetchPlace, searchPlaces };
