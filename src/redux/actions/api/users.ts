import Store from '@redux/store';
import { User } from '@ts/types';
import {
  UPDATE_USERS_DATA,
  UPDATE_USERS_SEARCH,
  UPDATE_USERS_ITEM,
  UPDATE_USERS_STATE,
  CLEAR_USERS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: User[]) => data.sort((a, b) => a.name.localeCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques users depuis le serveur
 * @param next Si il faut récupérer les users après le dernier
 */
async function updateUsers(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_USERS_DATA,
      stateUpdate: UPDATE_USERS_STATE,
      url: 'users/list',
      sort: nameAscSort,
      dataType: 'users',
      params,
      type,
    }),
  );
}

async function searchUsers(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_USERS_SEARCH,
      stateUpdate: UPDATE_USERS_STATE,
      url: 'users/list',
      dataType: 'users',
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
 * Récupère toutes les infos publiques d'un seul user
 * @param userId L'id de l'user à récuperer
 */
async function fetchUser(userId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_USERS_ITEM,
      stateUpdate: UPDATE_USERS_STATE,
      url: 'users/info',
      dataType: 'users',
      params: { userId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearUsers(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_USERS, data, search }));
}

export { updateUsers, clearUsers, fetchUser, searchUsers };
