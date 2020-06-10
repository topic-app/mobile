import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateDescSort = (data) =>
  data.sort((a, b) => (new Date(a.duration.end) > new Date(b.duration.end) ? -1 : 1));

/**
 * @docs actions
 * Récupère les infos basiques petitions depuis le serveur
 * @param next Si il faut récupérer les petitions après le dernier
 */
function updatePetitions(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_PETITIONS',
      stateUpdate: 'UPDATE_PETITIONS_STATE',
      url: 'petitions/list',
      sort: dateDescSort,
      dataType: 'places',
      type,
      params,
    }),
  );
}

function searchPetitions(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_PETITIONS', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_PETITIONS_SEARCH',
      stateUpdate: 'UPDATE_PETITIONS_STATE',
      url: 'petitions/list',
      dataType: 'petitions',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul petition
 * @param petitionId L'id de l'petition à récuperer
 */
function fetchPetition(petitionId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_PETITIONS',
      stateUpdate: 'UPDATE_PETITIONS_STATE',
      url: 'petitions/list',
      sort: dateDescSort,
      dataType: 'places',
      params: { petitionId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearPetitions() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_PETITIONS' }));
}

export { updatePetitions, clearPetitions, fetchPetition, searchPetitions };
