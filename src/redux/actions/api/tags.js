import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data) => data.sort((a, b) => a.name.localCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques tags depuis le serveur
 * @param next Si il faut récupérer les tags après le dernier
 */
function updateTags(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_TAGS',
      stateUpdate: 'UPDATE_TAGS_STATE',
      url: 'tags/list',
      sort: nameAscSort,
      dataType: 'tags',
      type,
      params,
    }),
  );
}

function searchTags(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_TAGS', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_TAGS_SEARCH',
      stateUpdate: 'UPDATE_TAGS_STATE',
      url: 'tags/list',
      dataType: 'tags',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul tag
 * @param tagId L'id de l'tag à récuperer
 */
function fetchTag(tagId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_TAGS',
      stateUpdate: 'UPDATE_TAGS_STATE',
      url: 'tags/list',
      sort: nameAscSort,
      dataType: 'tags',
      params: { tagId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearTags() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_TAGS' }));
}

export { updateTags, clearTags, fetchTag, searchTags };
