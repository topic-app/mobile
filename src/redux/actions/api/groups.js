import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateGroups
 * @param next Si il faut récupérer les groups après le dernier
 * @returns Action
 */
function updateGroupsCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_GROUPS_STATE',
      data: {
        list: {
          loading: {
            initial: type === 'initial',
            refresh: type === 'refresh',
            next: type === 'next',
          },
          success: null,
          error: null,
        },
      },
    });
    if (type === 'next') {
      const groups = getState().groups.data;
      // groups.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = groups[groups.length - 1]._id;
      number = 5;
    }
    request('groups/list', 'get', { lastId, number, ...params })
      .then((result) => {
        const { data } = getState().groups; // The old groups, in redux db
        result.data.groups.forEach((a) => {
          const group = { ...a, preload: true };
          if (data.some((p) => p._id === a._id)) {
            data[data.map((p) => p._id).indexOf(a._id)] = group;
          } else {
            data.push(group);
          }
        });
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_GROUPS',
          data,
        });
        return dispatch({
          type: 'UPDATE_GROUPS_STATE',
          data: {
            list: {
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
        return dispatch({
          type: 'UPDATE_GROUPS_STATE',
          data: {
            list: {
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

/**
 * @docs actionCreators
 * Créateur d'action pour fetchGroup
 * @param groupId L'id de l'group que l'on veut chercher
 * @returns Action
 */
function fetchGroupCreator(groupId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_GROUPS_STATE',
      data: {
        info: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    request('groups/info', 'get', { groupId })
      .then((result) => {
        const { groups } = result.data;
        const group = groups[0];
        const { data } = getState().groups; // The old groups, in redux db
        if (data.some((p) => p._id === group._id)) {
          data[data.map((p) => p._id).indexOf(group._id)] = group;
        } else {
          data.push(group);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_GROUPS',
          data,
        });
        return dispatch({
          type: 'UPDATE_GROUPS_STATE',
          data: {
            info: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_GROUPS_STATE',
          data: {
            info: {
              loading: false,
              success: false,
              error: err,
            },
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour clearGroups
 * @returns Action
 */
function clearGroupsCreator() {
  return {
    type: 'CLEAR_GROUPS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques groups depuis le serveur
 * @param next Si il faut récupérer les groups après le dernier
 */
function updateGroups(type, params) {
  return Store.dispatch(updateGroupsCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul group
 * @param groupId L'id de l'group à récuperer
 */
function fetchGroup(groupId) {
  return Store.dispatch(fetchGroupCreator(groupId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearGroups() {
  return Store.dispatch(clearGroupsCreator());
}

export { updateGroups, clearGroups, fetchGroup };
