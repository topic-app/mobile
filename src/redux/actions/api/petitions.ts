import Store from '@redux/store';
import { Petition, Item } from '@ts/types';
import {
  UPDATE_PETITIONS_DATA,
  UPDATE_PETITIONS_SEARCH,
  UPDATE_PETITIONS_ITEM,
  UPDATE_PETITIONS_STATE,
  CLEAR_PETITIONS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateDescSort = (data: Item[]) =>
  (data as Petition[]).sort((a, b) =>
    new Date(a.duration.end) > new Date(b.duration.end) ? -1 : 1,
  );

/**
 * @docs actions
 * Récupère les infos basiques petitions depuis le serveur
 * @param next Si il faut récupérer les petitions après le dernier
 */
async function updatePetitions(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_PETITIONS_DATA,
      stateUpdate: UPDATE_PETITIONS_STATE,
      url: 'petitions/list',
      sort: dateDescSort,
      dataType: 'places',
      type,
      params,
    }),
  );
}

async function searchPetitions(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_PETITIONS_SEARCH,
      stateUpdate: UPDATE_PETITIONS_STATE,
      url: 'petitions/list',
      dataType: 'petitions',
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
 * Récupère toutes les infos publiques d'un seul petition
 * @param petitionId L'id de l'petition à récuperer
 */
async function fetchPetition(petitionId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_PETITIONS_ITEM,
      stateUpdate: UPDATE_PETITIONS_STATE,
      url: 'petitions/list',
      dataType: 'places',
      params: { petitionId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearPetitions(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_PETITIONS, data, search }));
}

export { updatePetitions, clearPetitions, fetchPetition, searchPetitions };
