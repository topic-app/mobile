import Store from '@redux/store';
import { Comment } from '@ts/types';
import { UPDATE_COMMENTS_DATA, UPDATE_COMMENTS_STATE, CLEAR_COMMENTS } from '@ts/redux';

import { clearCreator, updateCreator } from './ActionCreator';

const dateDescSort = (data: Comment[]) =>
  data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

/**
 * @docs actions
 * Récupère les infos basiques comments depuis le serveur
 * @param next Si il faut récupérer les comments après le dernier
 */
async function updateComments(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_COMMENTS_DATA,
      stateUpdate: UPDATE_COMMENTS_STATE,
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
async function clearComments(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_COMMENTS, data, search }));
}

export { updateComments, clearComments };
