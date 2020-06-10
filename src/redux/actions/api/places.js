import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data) => data.sort((a, b) => a.name.localCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques places depuis le serveur
 * @param next Si il faut récupérer les places après le dernier
 */
function updatePlaces(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_PLACES',
      stateUpdate: 'UPDATE_PLACES_STATE',
      url: 'places/list',
      sort: nameAscSort,
      dataType: 'places',
      type,
      params,
    }),
  );
}

function searchPlaces(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_PLACES', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_PLACES_SEARCH',
      stateUpdate: 'UPDATE_PLACES_STATE',
      url: 'places/list',
      dataType: 'places',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul place
 * @param placeId L'id de l'place à récuperer
 */
function fetchPlace(placeId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_PLACES',
      stateUpdate: 'UPDATE_PLACES_STATE',
      url: 'places/list',
      sort: nameAscSort,
      dataType: 'places',
      params: { placeId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearPlaces() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_PLACES' }));
}

export { updatePlaces, clearPlaces, fetchPlace, searchPlaces };
