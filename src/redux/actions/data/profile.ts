import { request } from '@utils/index';
import Store from '@redux/store';
import { hashPassword } from '@utils/crypto';
import { State, UPDATE_ACCOUNT_STATE, User } from '@ts/types';

/**
 * @docs actionCreators
 * Modifie le data du compte
 * @param fields Les données à modifier
 * @returns Action
 */
function updateDataCreator(fields: Partial<User>) {
  return (dispatch: (action: any) => void, getState: () => State) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });

      try {
        await request('profile/modify/data', 'post', { data: fields }, true);
      } catch (error) {
        dispatch({
          type: UPDATE_ACCOUNT_STATE,
          data: {
            updateProfile: {
              loading: false,
              success: false,
              error,
            },
          },
        });
        reject();
        return;
      }

      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: false,
            success: true,
            error: null,
          },
        },
      });
      resolve();
    });
  };
}

/**
 * @docs actionCreators
 * Modifie le username du compte
 * @param username Le nom d'utilisateur
 * @returns Action
 */
function updateUsernameCreator(username: string) {
  return (dispatch: (action: any) => void) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });

      try {
        await request('profile/modify/username', 'post', { username }, true);
      } catch (error) {
        dispatch({
          type: UPDATE_ACCOUNT_STATE,
          data: {
            updateProfile: {
              loading: false,
              success: false,
              error,
            },
          },
        });
        reject();
        return;
      }

      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: false,
            success: true,
            error: null,
          },
        },
      });
      resolve();
    });
  };
}

/**
 * @docs actionCreators
 * Modifie le username du compte
 * @param username Le nom d'utilisateur
 * @returns Action
 */
function updateEmailCreator(email: string) {
  return (dispatch: (action: any) => void) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });

      try {
        await request('profile/modify/email', 'post', { email }, true);
      } catch (error) {
        dispatch({
          type: UPDATE_ACCOUNT_STATE,
          data: {
            updateProfile: {
              loading: false,
              success: false,
              error,
            },
          },
        });
        reject();
        return;
      }

      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: false,
            success: true,
            error: null,
          },
        },
      });
      resolve();
    });
  };
}

function updatePasswordCreator(password: string) {
  return (dispatch: (action: any) => void) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });

      try {
        let newPassword = await hashPassword(password);
        await request('profile/modify/password', 'post', { password: newPassword }, true);
      } catch (error) {
        dispatch({
          type: UPDATE_ACCOUNT_STATE,
          data: {
            updateProfile: {
              loading: false,
              success: false,
              error,
            },
          },
        });
        reject();
        return;
      }

      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          updateProfile: {
            loading: false,
            success: true,
            error: null,
          },
        },
      });
      resolve();
    });
  };
}

async function updateData(fields: Partial<User>) {
  await Store.dispatch(updateDataCreator(fields));
}

async function updateUsername(username: string) {
  await Store.dispatch(updateUsernameCreator(username));
}

async function updateEmail(email: string) {
  await Store.dispatch(updateEmailCreator(email));
}

async function updatePassword(password: string) {
  await Store.dispatch(updatePasswordCreator(password));
}

export { updateData, updateUsername, updateEmail, updatePassword };
