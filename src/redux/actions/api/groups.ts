import Store from '@redux/store';
import {
  UPDATE_GROUPS_DATA,
  UPDATE_GROUPS_TEMPLATES,
  UPDATE_GROUPS_SEARCH,
  UPDATE_GROUPS_ITEM,
  UPDATE_GROUPS_VERIFICATION,
  UPDATE_GROUPS_STATE,
  CLEAR_GROUPS,
  AppThunk,
} from '@ts/redux';
import { Group, GroupTemplate } from '@ts/types';
import { request, logger } from '@utils/index';

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
      listName: 'data',
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
      stateName: 'info',
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
      stateName: 'info',
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
function clearGroups(data = true, search = true, templates = true) {
  Store.dispatch(clearCreator({ clear: CLEAR_GROUPS, data, search, templates }));
}

/**
 * @docs actions
 * Récupère les templates de création de groupe
 * @param next Si il faut récupérer les groupes après le dernier
 */
function updateGroupTemplatesCreator(): AppThunk {
  return (dispatch) => {
    dispatch({
      type: UPDATE_GROUPS_STATE,
      data: {
        templates: {
          loading: { initial: true },
          success: null,
          error: null,
        },
      },
    });
    request('groups/templates/list', 'get', {}, true)
      .then((result) => {
        const data: GroupTemplate[] = result.data?.templates;
        dispatch({
          type: UPDATE_GROUPS_TEMPLATES,
          data,
        });
        return dispatch({
          type: UPDATE_GROUPS_STATE,
          data: {
            templates: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
              success: true,
              error: null,
            },
          },
        });
      })
      .catch((error) => {
        logger.error(error);
        return dispatch({
          type: UPDATE_GROUPS_STATE,
          data: {
            templates: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
              success: false,
              error,
            },
          },
        });
      });
  };
}

async function updateGroupTemplates() {
  await Store.dispatch(updateGroupTemplatesCreator());
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
