import request from '@utils/request';
import Store from '@redux/store';

function fetchGroupsCreator() {
  return (dispatch, getState) => {
    if (!getState().account.loggedIn) {
      dispatch({
        type: 'UPDATE_ACCOUNT_GROUPS',
        data: [],
      });
      return dispatch({
        type: 'UPDATE_ACCOUNT_PERMISSIONS',
        data: [],
      });
    }
    dispatch({
      type: 'UPDATE_ACCOUNT_STATE',
      data: {
        fetchGroups: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    request('groups/my', 'get', {
      accountId: getState().account.accountInfo.accountId,
      accountToken: getState().account.accountInfo.accountToken,
    })
      .then((result) => {
        dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            fetchGroups: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
        dispatch({
          type: 'UPDATE_ACCOUNT_GROUPS',
          data: result.data.groups,
        });
      })
      .catch((err) => {
        dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            fetchGroups: {
              success: false,
              loading: false,
              error: err,
            },
          },
        });
      });
  };
}

function fetchAccountCreator() {
  return (dispatch, getState) => {
    if (!getState().account.loggedIn) {
      return dispatch({
        type: 'LOGOUT',
        data: null,
      });
    }
    dispatch({
      type: 'UPDATE_ACCOUNT_STATE',
      data: {
        fetchAccount: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    request('profile/info', 'get', {
      accountId: getState().account.accountInfo.accountId,
      accountToken: getState().account.accountInfo.accountToken,
    })
      .then((result) => {
        dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            fetchAccount: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
        dispatch({
          type: 'UPDATE_ACCOUNT_USER',
          data: result.data.profile[0], // TEMP: This should change on server
        });
      })
      .catch((err) => {
        dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            fetchAccount: {
              success: false,
              loading: false,
              error: err,
            },
          },
        });
      });
  };
}

function updateCreationDataCreator(fields) {
  return {
    type: 'UPDATE_CREATION_DATA',
    data: fields,
  };
}

function clearCreationDataCreator() {
  return {
    type: 'CLEAR_CREATION_DATA',
    data: {},
  };
}

function updateStateCreator(state) {
  return {
    type: 'UPDATE_ACCOUNT_STATE',
    data: state,
  };
}

function loginCreator(fields) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ACCOUNT_STATE',
      data: {
        login: {
          loading: true,
          success: null,
          error: null,
          incorrect: null,
        },
      },
    });
    request('auth/login/local', 'post', fields)
      .then((result) => {
        if (!result.data.correct) {
          return dispatch({
            type: 'UPDATE_ACCOUNT_STATE',
            data: {
              login: {
                loading: false,
                success: null,
                error: null,
                incorrect: true,
              },
            },
          });
        }
        dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            login: {
              loading: false,
              success: true,
              error: null,
              incorrect: false,
            },
          },
        });
        dispatch({
          type: 'LOGIN',
          data: result.data,
        });
        Store.dispatch(fetchAccountCreator());
        Store.dispatch(fetchGroupsCreator());
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            login: {
              success: false,
              loading: false,
              error: err,
              incorrect: null,
            },
          },
        });
      });
  };
}

function registerCreator(fields) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ACCOUNT_STATE',
      data: {
        register: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    request('auth/register/local', 'post', fields)
      .then((result) => {
        dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            register: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
        dispatch({
          type: 'LOGIN',
          data: result.data,
        });
        Store.dispatch(fetchAccountCreator());
        Store.dispatch(fetchGroupsCreator());
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_ACCOUNT_STATE',
          data: {
            register: {
              success: false,
              loading: false,
              error: err,
            },
          },
        });
      });
  };
}

function logoutCreator() {}

/* Actions */

function login(fields) {
  return Store.dispatch(loginCreator(fields));
}

function updateState(fields) {
  return Store.dispatch(updateStateCreator(fields));
}

function register(fields) {
  return Store.dispatch(registerCreator(fields));
}

function logout() {}

function updateCreationData(params) {
  return Store.dispatch(updateCreationDataCreator(params));
}

function clearCreationData(params) {
  return Store.dispatch(clearCreationDataCreator());
}

function fetchGroups() {
  return Store.dispatch(fetchGroupsCreator());
}

function fetchAccount() {
  return Store.dispatch(fetchAccountCreator());
}

export {
  updateCreationData,
  clearCreationData,
  fetchGroups,
  fetchAccount,
  register,
  login,
  updateState,
};
