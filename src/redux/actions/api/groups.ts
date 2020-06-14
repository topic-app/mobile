import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data) => data.sort((a, b) => a.name.localCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques groups depuis le serveur
 * @param next Si il faut récupérer les groups après le dernier
 */
function updateGroups(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_GROUPS',
      stateUpdate: 'UPDATE_GROUPS_STATE',
      url: 'groups/list',
      sort: nameAscSort,
      dataType: 'groups',
      type,
      params,
    }),
  );
}

function searchGroups(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_GROUPS', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_GROUPS_SEARCH',
      stateUpdate: 'UPDATE_GROUPS_STATE',
      url: 'groups/list',
      dataType: 'groups',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul group
 * @param groupId L'id de l'group à récuperer
 */
function fetchGroup(groupId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_GROUPS',
      stateUpdate: 'UPDATE_GROUPS_STATE',
      url: 'groups/list',
      sort: nameAscSort,
      dataType: 'groups',
      params: { groupId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearGroups() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_GROUPS' }));
}

export { updateGroups, clearGroups, fetchGroup, searchGroups };
