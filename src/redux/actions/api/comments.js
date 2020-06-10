import Store from '@redux/store';

import { clearCreator, updateCreator } from './ActionCreator';

const dateDescSort = (data) => data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

/**
 * @docs actions
 * Récupère les infos basiques comments depuis le serveur
 * @param next Si il faut récupérer les comments après le dernier
 */
function updateComments(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_COMMENTS',
      stateUpdate: 'UPDATE_COMMENTS_STATE',
      url: 'comments/list',
      sort: dateDescSort,
      dataType: 'comments',
      type,
      params,
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearComments() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_COMMENTS' }));
}

export { updateComments, clearComments };
