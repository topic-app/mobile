import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateTags
 * @param next Si il faut récupérer les tags après le dernier
 * @returns Action
 */
function updateTagsCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_TAGS_STATE',
      data: {
        loading: {
          initial: type === 'initial',
          refresh: type === 'refresh',
          next: type === 'next',
          tag: getState().tags.state.loading.tag,
        },
        success: null,
        error: null,
      },
    });
    if (type === 'next') {
      const tags = getState().tags.data;
      // tags.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = tags[tags.length - 1]._id;
      number = 5;
    }
    request('tags/list', 'get', { lastId, number, ...params })
      .then((result) => {
        if (result.success) {
          const { data } = getState().tags; // The old tags, in redux db
          result.data.tags.forEach((a) => {
            const tag = { ...a, preload: true };
            if (data.some((p) => p._id === a._id)) {
              data[data.map((p) => p._id).indexOf(a._id)] = tag;
            } else {
              data.push(tag);
            }
          });
          data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
          dispatch({
            type: 'UPDATE_TAGS',
            data,
          });
          return dispatch({
            type: 'UPDATE_TAGS_STATE',
            data: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
                tag: getState().tags.state.loading.tag,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_TAGS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              tag: getState().tags.state.loading.tag,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_TAGS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              tag: getState().tags.state.loading.tag,
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
 * Créateur d'action pour fetchTag
 * @param tagId L'id de l'tag que l'on veut chercher
 * @returns Action
 */
function fetchTagCreator(tagId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_TAGS_STATE',
      data: {
        loading: {
          initial: getState().tags.state.loading.initial,
          refresh: getState().tags.state.loading.refresh,
          next: getState().tags.state.loading.next,
          tag: true,
        },
        success: null,
        error: null,
      },
    });
    request('tags/info', 'get', { tagId })
      .then((result) => {
        const { tags } = result.data;
        const tag = tags[0];
        const { data } = getState().tags; // The old tags, in redux db
        if (data.some((p) => p._id === tag._id)) {
          data[data.map((p) => p._id).indexOf(tag._id)] = tag;
        } else {
          data.push(tag);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        if (result.success) {
          dispatch({
            type: 'UPDATE_TAGS',
            data,
          });
          return dispatch({
            type: 'UPDATE_TAGS_STATE',
            data: {
              loading: {
                initial: getState().tags.state.loading.initial,
                refresh: getState().tags.state.loading.refresh,
                next: getState().tags.state.loading.next,
                tag: false,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`ERROR: ${result}`);
        return dispatch({
          type: 'UPDATE_TAGS_STATE',
          data: {
            loading: {
              initial: getState().tags.state.loading.initial,
              refresh: getState().tags.state.loading.refresh,
              next: getState().tags.state.loading.next,
              tag: false,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        console.log(`ERROR: ${err}`);
        return dispatch({
          type: 'UPDATE_TAGS_STATE',
          data: {
            loading: {
              initial: getState().tags.state.loading.initial,
              refresh: getState().tags.state.loading.refresh,
              next: getState().tags.state.loading.next,
              tag: false,
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
 * Créateur d'action pour clearTags
 * @returns Action
 */
function clearTagsCreator() {
  return {
    type: 'CLEAR_TAGS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques tags depuis le serveur
 * @param next Si il faut récupérer les tags après le dernier
 */
function updateTags(type, params) {
  return Store.dispatch(updateTagsCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul tag
 * @param tagId L'id de l'tag à récuperer
 */
function fetchTag(tagId) {
  return Store.dispatch(fetchTagCreator(tagId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearTags() {
  return Store.dispatch(clearTagsCreator());
}

export { updateTags, clearTags, fetchTag };
