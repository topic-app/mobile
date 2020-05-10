import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateComments
 * @param next Si il faut récupérer les comments après le dernier
 * @returns Action
 */
function updateCommentsCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_COMMENTS_STATE',
      data: {
        loading: {
          initial: type === 'initial',
          refresh: type === 'refresh',
          next: type === 'next',
          comment: getState().comments.state.loading.comment,
        },
        success: null,
        error: null,
      },
    });
    if (type === 'next') {
      const comments = getState().comments.data;
      // comments.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = comments[comments.length - 1]._id;
      number = 5;
    }
    request('comments/list', 'get', { lastId, number, ...params })
      .then((result) => {
        if (result.success) {
          const { data } = getState().comments; // The old comments, in redux db
          result.data.comments.forEach((a) => {
            const comment = { ...a, preload: true };
            if (data.some((p) => p._id === a._id)) {
              data[data.map((p) => p._id).indexOf(a._id)] = comment;
            } else {
              data.push(comment);
            }
          });
          data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
          dispatch({
            type: 'UPDATE_COMMENTS',
            data,
          });
          return dispatch({
            type: 'UPDATE_COMMENTS_STATE',
            data: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
                comment: getState().comments.state.loading.comment,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_COMMENTS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              comment: getState().comments.state.loading.comment,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_COMMENTS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              comment: getState().comments.state.loading.comment,
            },
            success: false,
            error: err,
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour clearComments
 * @returns Action
 */
function clearCommentsCreator() {
  return {
    type: 'CLEAR_COMMENTS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques comments depuis le serveur
 * @param next Si il faut récupérer les comments après le dernier
 */
function updateComments(type, params) {
  return Store.dispatch(updateCommentsCreator(type, params));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearComments() {
  return Store.dispatch(clearCommentsCreator());
}

export { updateComments, clearComments };
