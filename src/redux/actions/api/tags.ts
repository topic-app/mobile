import Store from '@redux/store';

import { Tag, Item } from '@ts/types';
import {
  UPDATE_TAGS_DATA,
  UPDATE_TAGS_SEARCH,
  UPDATE_TAGS_ITEM,
  UPDATE_TAGS_STATE,
  CLEAR_TAGS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: Item[]) => (data as Tag[]).sort((a, b) => a.name.localeCompare(b.name));

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
async function clearTags(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_TAGS, data, search }));
}

export { updateTags, clearTags, fetchTag, searchTags };
