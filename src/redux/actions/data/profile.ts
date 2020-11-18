import { request } from '@utils/index';
import Store from '@redux/store';
import { hashPassword } from '@utils/crypto';
import { AppThunk, UPDATE_ACCOUNT_STATE, User } from '@ts/types';

/**
 * @docs actionCreators
 * Modifie le data du compte
 * @param fields Les données à modifier
 * @returns Action
 */
function updateDataCreator(fields: Partial<User>): AppThunk {
  return async (dispatch) => {
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
      return Promise.reject();
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
    return Promise.resolve();
  };
}

type UpdateStringCreatorParams = {
  url: string;
  params: { [key: string]: any };
};

/**
 * @docs actionCreators
 * Modifie un string quelquonque du compte
 * @param url L'url à appeler, sans la base (eg. 'articles/list')
 * @param params Les paramètres de la requête
 * @returns Action
 */
function updateProfileStringCreator({ url, params }: UpdateStringCreatorParams): AppThunk {
  return async (dispatch) => {
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
      await request(url, 'post', params, true);
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
      return Promise.reject();
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
    return Promise.resolve();
  };
}

async function updateData(fields: Partial<User>) {
  await Store.dispatch(updateDataCreator(fields));
}

async function updateUsername(username: string) {
  await Store.dispatch(
    updateProfileStringCreator({
      url: 'profile/modify/username',
      params: { username },
    }),
  );
}

async function updateEmail(email: string) {
  await Store.dispatch(
    updateProfileStringCreator({
      url: 'profile/modify/email',
      params: { email },
    }),
  );
}

async function updatePassword(password: string) {
  const hashedPassword = await hashPassword(password);
  await Store.dispatch(
    updateProfileStringCreator({
      url: 'profile/modify/password',
      params: { password: hashedPassword },
    }),
  );
}

export { updateData, updateUsername, updateEmail, updatePassword };
