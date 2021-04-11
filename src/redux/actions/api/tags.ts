import Store from '@redux/store';
import {
  UPDATE_TAGS_DATA,
  UPDATE_TAGS_SEARCH,
  UPDATE_TAGS_ITEM,
  UPDATE_TAGS_STATE,
  CLEAR_TAGS,
} from '@ts/redux';
import { Tag } from '@ts/types';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: Tag[]) => data.sort((a, b) => a.name.localeCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques tags depuis le serveur
 * @param next Si il faut récupérer les tags après le dernier
 */
async function updateTags(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_TAGS_DATA,
      stateUpdate: UPDATE_TAGS_STATE,
      url: '/tags/list',
      listName: 'data',
      sort: nameAscSort,
      dataType: 'tags',
      type,
      params,
    }),
  );
}

async function searchTags(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_TAGS_SEARCH,
      stateUpdate: UPDATE_TAGS_STATE,
      url: '/tags/list',
      dataType: 'tags',
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
 * Récupère toutes les infos publiques d'un seul tag
 * @param tagId L'id de l'tag à récuperer
 */
async function fetchTag(tagId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_TAGS_ITEM,
      stateUpdate: UPDATE_TAGS_STATE,
      stateName: 'info',
      url: 'tags/list',
      dataType: 'tags',
      params: { tagId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearTags(data = true, search = true, items = false, item = false) {
  Store.dispatch(clearCreator({ clear: CLEAR_TAGS, data, search, item, items }));
}

export { updateTags, clearTags, fetchTag, searchTags };
