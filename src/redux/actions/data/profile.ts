import Store from '@redux/store';
import { AppThunk, UPDATE_ACCOUNT_STATE, UPDATE_LINKING_STATE, User } from '@ts/types';
import { request } from '@utils';
import { hashPassword } from '@utils/crypto';

/**
 * @docs actionCreators
 * Modifie le data du compte
 * @param fields Les données à modifier
 * @returns Action
 */
function updateDataCreator(fields: Partial<User['data']>): AppThunk {
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
      throw error;
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
    return true;
  };
}

type UpdateStringCreatorParams = {
  url: 'profile/modify/username' | 'profile/modify/email' | 'profile/modify/password';
  params: { [key: string]: any };
  authServer?: boolean;
};

/**
 * @docs actionCreators
 * Modifie un string quelquonque du compte
 * @param url L'url à appeler, sans la base (eg. 'articles/list')
 * @param params Les paramètres de la requête
 * @returns Action
 */
function updateProfileStringCreator({
  url,
  params,
  authServer = false,
}: UpdateStringCreatorParams): AppThunk {
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
      await request(url, 'post', params, true, authServer ? 'auth' : 'base');
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
      throw error;
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
    return true;
  };
}

function emailChangeCreator({ id, token }: { id: string; token: string }): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        emailChange: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    try {
      await request('profile/modify/email/confirm', 'post', { id, token }, false, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_LINKING_STATE,
        data: {
          emailChange: {
            loading: false,
            success: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        emailChange: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

function emailVerifyCreator({ id, token }: { id: string; token: string }): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        emailVerify: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    try {
      await request('auth/email/verify', 'post', { id, token }, false, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_LINKING_STATE,
        data: {
          emailVerify: {
            loading: false,
            success: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        emailVerify: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

type ExtraParams = {
  articles: boolean;
  events: boolean;
  places: boolean;
  comments: boolean;
};

function accountDeleteCreator({
  id,
  token,
  extra,
}: {
  id: string;
  token: string;
  extra: ExtraParams;
}): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        accountDelete: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    try {
      await request('profile/delete/verify', 'post', { id, token, extra }, false, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_LINKING_STATE,
        data: {
          accountDelete: {
            loading: false,
            success: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        accountDelete: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

function passwordResetCreator({
  id,
  token,
  password,
}: {
  id: string;
  token: string;
  password: string;
}): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        passwordReset: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    try {
      await request('auth/password/reset', 'post', { id, token, password }, false, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_LINKING_STATE,
        data: {
          passwordReset: {
            loading: false,
            success: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_LINKING_STATE,
      data: {
        passwordReset: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

function resendVerificationCreator(): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        resend: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    try {
      await request('auth/email/resend', 'post', {}, true, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          resend: {
            loading: false,
            success: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        resend: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

async function updateData(fields: Partial<User['data']>) {
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
      authServer: true,
    }),
  );
}

async function updatePassword(password: string) {
  const hashedPassword = await hashPassword(password);
  await Store.dispatch(
    updateProfileStringCreator({
      url: 'profile/modify/password',
      params: { password: hashedPassword },
      authServer: true,
    }),
  );
}

async function emailChange(id: string, token: string) {
  await Store.dispatch(emailChangeCreator({ id, token }));
}

async function emailVerify(id: string, token: string) {
  await Store.dispatch(emailVerifyCreator({ id, token }));
}

async function accountDelete(id: string, token: string, extra: ExtraParams) {
  await Store.dispatch(accountDeleteCreator({ id, token, extra }));
}

async function passwordReset(id: string, token: string, password: string) {
  const hashedPassword = await hashPassword(password);
  await Store.dispatch(passwordResetCreator({ id, token, password: hashedPassword }));
}

async function resendVerification() {
  await Store.dispatch(resendVerificationCreator());
}

export {
  updateData,
  updateUsername,
  updateEmail,
  updatePassword,
  emailChange,
  emailVerify,
  accountDelete,
  passwordReset,
  resendVerification,
};
