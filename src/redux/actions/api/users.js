import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateUsers
 * @param next Si il faut récupérer les users après le dernier
 * @returns Action
 */
function updateUsersCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_USERS_STATE',
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
      const users = getState().users.data;
      // users.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = users[users.length - 1]._id;
      number = 5;
    }
    request('users/list', 'get', { lastId, number, ...params })
      .then((result) => {
        const { data } = getState().users; // The old users, in redux db
        result.data.users.forEach((a) => {
          const user = { ...a, preload: true };
          if (data.some((p) => p._id === a._id)) {
            data[data.map((p) => p._id).indexOf(a._id)] = user;
          } else {
            data.push(user);
          }
        });
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_USERS',
          data,
        });
        return dispatch({
          type: 'UPDATE_USERS_STATE',
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
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_USERS_STATE',
          data: {
            list: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
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
 * Créateur d'action pour fetchUser
 * @param userId L'id de l'user que l'on veut chercher
 * @returns Action
 */
function fetchUserCreator(userId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_USERS_STATE',
      data: {
        info: { loading: true, success: null, error: null },
      },
    });
    request('users/info', 'get', { userId })
      .then((result) => {
        const { users } = result.data;
        const user = users[0];
        const { data } = getState().users; // The old users, in redux db
        if (data.some((p) => p._id === user._id)) {
          data[data.map((p) => p._id).indexOf(user._id)] = user;
        } else {
          data.push(user);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_USERS',
          data,
        });
        return dispatch({
          type: 'UPDATE_USERS_STATE',
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
          type: 'UPDATE_USERS_STATE',
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
 * Créateur d'action pour clearUsers
 * @returns Action
 */
function clearUsersCreator() {
  return {
    type: 'CLEAR_USERS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques users depuis le serveur
 * @param next Si il faut récupérer les users après le dernier
 */
function updateUsers(type, params) {
  return Store.dispatch(updateUsersCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul user
 * @param userId L'id de l'user à récuperer
 */
function fetchUser(userId) {
  return Store.dispatch(fetchUserCreator(userId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearUsers() {
  return Store.dispatch(clearUsersCreator());
}

export { updateUsers, clearUsers, fetchUser };
