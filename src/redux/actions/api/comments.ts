import Store from '@redux/store';
import {
  UPDATE_COMMENTS_DATA,
  UPDATE_COMMENTS_STATE,
  CLEAR_COMMENTS,
  UPDATE_COMMENTS_VERIFICATION,
} from '@ts/redux';
import { Comment } from '@ts/types';

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
      listName: 'data',
      sort: dateDescSort,
      dataType: 'comments',
      type,
      params,
    }),
  );
}

async function updateCommentsVerification(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_COMMENTS_VERIFICATION,
      stateName: 'verification_list',
      stateUpdate: UPDATE_COMMENTS_STATE,
      url: 'comments/verification/list',
      listName: 'verification',
      sort: dateDescSort,
      dataType: 'comments',
      type,
      params,
      auth: true,
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearComments(data = false, search = false) {
  Store.dispatch(clearCreator({ clear: CLEAR_COMMENTS, data, search }));
}

export { updateComments, updateCommentsVerification, clearComments };
