import Store from '@redux/store';
import { Group } from '@ts/types';
import {
  UPDATE_GROUPS_DATA,
  UPDATE_GROUPS_SEARCH,
  UPDATE_GROUPS_ITEM,
  UPDATE_GROUPS_STATE,
  CLEAR_GROUPS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: Group[]) => data.sort((a, b) => a.name.localeCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques groups depuis le serveur
 * @param next Si il faut récupérer les groups après le dernier
 */
async function updateGroups(
  type: 'initial' | 'refresh' | 'next',
  params = {},
  useDefaultParams = true,
) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_GROUPS_DATA,
      stateUpdate: UPDATE_GROUPS_STATE,
      url: 'groups/list',
      sort: nameAscSort,
      dataType: 'groups',
      type,
      params: useDefaultParams
        ? {
            schools: Store.getState().location.schools,
            departments: Store.getState().location.departments,
            global: Store.getState().location.global,
            ...params,
          }
        : params,
    }),
  );
}

async function searchGroups(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_GROUPS_SEARCH,
      stateUpdate: UPDATE_GROUPS_STATE,
      url: 'groups/list',
      dataType: 'groups',
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
 * Récupère toutes les infos publiques d'un seul group
 * @param groupId L'id de l'group à récuperer
 */
async function fetchGroup(groupId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_GROUPS_ITEM,
      stateUpdate: UPDATE_GROUPS_STATE,
      url: 'groups/info',
      dataType: 'groups',
      params: { groupId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearGroups(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_GROUPS, data, search }));
}

export { updateGroups, clearGroups, fetchGroup, searchGroups };
