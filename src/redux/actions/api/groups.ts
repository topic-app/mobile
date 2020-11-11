import Store from '@redux/store';
import { Group, Item } from '@ts/types';
import {
  UPDATE_GROUPS_DATA,
  UPDATE_GROUPS_TEMPLATES,
  UPDATE_GROUPS_SEARCH,
  UPDATE_GROUPS_ITEM,
  UPDATE_GROUPS_VERIFICATION,
  UPDATE_GROUPS_STATE,
  CLEAR_GROUPS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: Item[]) =>
  (data as Group[]).sort((a, b) => a.name.localeCompare(b.name));

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

async function searchGroups(
  type: 'initial' | 'refresh' | 'next',
  terms: string,
  params = {},
  search = true,
) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_GROUPS_SEARCH,
      stateUpdate: UPDATE_GROUPS_STATE,
      url: 'groups/list',
      dataType: 'groups',
      type,
      params: { ...params, search, terms },
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
 * Récupère les infos sur les groupes a verifier
 * @param type [initial, next, refresh] le type de récupération. Si c'est next, il récupère automatiquement les articles après le dernier contenu dans redux
 * @param terms Le texte pour rechercher
 * @param params Les paramètres supplémentaires pour la requete (eg. tags, auteurs)
 */
async function updateGroupsVerification(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_GROUPS_VERIFICATION,
      stateUpdate: UPDATE_GROUPS_STATE,
      url: 'groups/verification/list',
      dataType: 'groups',
      type,
      params,
      stateName: 'verification_list',
      listName: 'verification',
      clear: type !== 'next',
      auth: true,
    }),
  );
}

async function fetchGroupVerification(groupId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_GROUPS_ITEM,
      stateUpdate: UPDATE_GROUPS_STATE,
      url: 'groups/verification/info',
      dataType: 'groups',
      params: { groupId },
      auth: true,
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

/**
 * @docs actions
 * Récupère les templates de création de groupe
 * @param next Si il faut récupérer les groups après le dernier
 */
async function updateGroupTemplates() {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_GROUPS_TEMPLATES,
      stateUpdate: UPDATE_GROUPS_STATE,
      url: 'groups/templates/list',
      sort: nameAscSort,
      stateName: 'templates',
      dataType: 'groups', // This is useless but typescript
      type: 'initial',
      params: {},
      clear: true,
    }),
  );
}

export {
  updateGroups,
  clearGroups,
  fetchGroup,
  searchGroups,
  updateGroupTemplates,
  updateGroupsVerification,
  fetchGroupVerification,
};
