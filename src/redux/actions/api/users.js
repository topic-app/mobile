import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data) => data.sort((a, b) => a.name.localCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques users depuis le serveur
 * @param next Si il faut récupérer les users après le dernier
 */
function updateUsers(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_USERS',
      stateUpdate: 'UPDATE_USERS_STATE',
      url: 'users/list',
      sort: nameAscSort,
      dataType: 'users',
      params,
      type,
    }),
  );
}

function searchUsers(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_USERS', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_USERS_SEARCH',
      stateUpdate: 'UPDATE_USERS_STATE',
      url: 'users/list',
      dataType: 'users',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul user
 * @param userId L'id de l'user à récuperer
 */
function fetchUser(userId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_USERS',
      stateUpdate: 'UPDATE_USERS_STATE',
      url: 'users/list',
      sort: nameAscSort,
      dataType: 'users',
      params: { userId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearUsers() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_USERS' }));
}

export { updateUsers, clearUsers, fetchUser, searchUsers };
