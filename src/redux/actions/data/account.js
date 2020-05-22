import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Ajoute des paramètres aux données de création de compte
 * @param lastId L'id du dernier article, par ordre chronologique, de la liste d'articles/database redux
 * @returns Action
 */
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
        return dispatch({
          type: 'LOGIN',
          data: result.data,
        });
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
        return dispatch({
          type: 'LOGIN',
          data: result.data,
        });
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

export { updateCreationData, clearCreationData, register, login, updateState };
