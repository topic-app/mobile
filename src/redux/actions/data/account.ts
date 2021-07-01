import { AnyAction } from 'redux';

import Store from '@redux/store';
import {
  GroupRolePermission,
  GroupRole,
  GroupWithMembership,
  UPDATE_ACCOUNT_GROUPS,
  UPDATE_ACCOUNT_PERMISSIONS,
  UPDATE_ACCOUNT_STATE,
  UPDATE_ACCOUNT_WAITING_GROUPS,
  UPDATE_ACCOUNT_NOTIFICATIONS,
  LOGOUT,
  UPDATE_ACCOUNT_USER,
  UPDATE_LOCATION,
  UPDATE_ACCOUNT_CREATION_DATA,
  CLEAR_ACCOUNT_CREATION_DATA,
  LOGIN,
  AccountRequestState,
  AppThunk,
  AccountCreationData,
  UPDATE_ACCOUNT_EMAIL,
  Location,
} from '@ts/types';
import { request, logger } from '@utils';

import { fetchLocationData } from './location';

function fetchGroupsCreator(): AppThunk {
  return async (dispatch, getState) => {
    if (!getState().account.loggedIn) {
      return null;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchGroups: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request('groups/my', 'get', {}, true);
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          fetchGroups: {
            success: false,
            loading: false,
            error: err,
          },
        },
      });
      throw err;
    }
    // TODO: This really needs unit tests
    let permissions: GroupRolePermission[] = [];
    result.data?.groups?.forEach((g: GroupWithMembership) => {
      const user = g?.membership;
      const userMainPermissions = g?.roles?.find((r) => r._id === user?.role)?.permissions;
      permissions = [
        ...permissions,
        ...(userMainPermissions || []).map((p) => {
          return { ...p, group: g._id };
        }),
      ];
      const userSecondaryPermissions = g?.roles
        .filter((r: GroupRole) => user?.secondaryRoles?.includes(r._id))
        .map((i: GroupRole) => i?.permissions)
        .flat();
      permissions = [
        ...permissions,
        ...(userSecondaryPermissions || [])?.map((p: GroupRolePermission) => {
          return { ...p, group: g._id };
        }),
      ];
    });
    permissions = permissions.flat();
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchGroups: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    dispatch({
      type: UPDATE_ACCOUNT_GROUPS,
      data: result.data?.groups,
    });
    dispatch({
      type: UPDATE_ACCOUNT_PERMISSIONS,
      data: permissions,
    });
    return true;
  };
}

function fetchWaitingGroupsCreator(): AppThunk {
  return async (dispatch, getState) => {
    if (!getState().account.loggedIn) {
      return null;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchWaitingGroups: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request('groups/members/waiting', 'get', {}, true);
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          fetchWaitingGroups: {
            success: false,
            loading: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_ACCOUNT_WAITING_GROUPS,
      data: result.data?.groups,
    });
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchWaitingGroups: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

function fetchAccountCreator(): AppThunk {
  return async (dispatch, getState) => {
    if (!getState().account.loggedIn) {
      return null;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchAccount: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request('profile/info', 'get', {}, true);
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          fetchAccount: {
            success: false,
            loading: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchAccount: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    dispatch({
      type: UPDATE_ACCOUNT_USER,
      data: result.data?.profile[0], // TEMP: This should change on server
    });
    const location: Location = result.data?.profile[0]?.data?.location;
    const data = {
      selected: true,
      schools: location?.schools?.map((l) => l._id)?.filter((s) => !!s) || [],
      departments: location?.departments?.map((l) => l._id)?.filter((l) => !!l) || [],
      global: location?.global || false,
    };
    dispatch({
      type: UPDATE_LOCATION,
      data,
    });
    fetchLocationData();
    return true;
  };
}

function fetchEmailCreator(): AppThunk {
  return async (dispatch, getState) => {
    if (!getState().account.loggedIn) {
      return null;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchEmail: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request('profile/email', 'get', {}, true, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          fetchEmail: {
            success: false,
            loading: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        fetchEmail: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    dispatch({
      type: UPDATE_ACCOUNT_EMAIL,
      data: result.data?.email, // TEMP: This should change on server
    });
    return true;
  };
}

function updateCreationDataCreator(fields: { [key: string]: any }): AnyAction {
  return {
    type: UPDATE_ACCOUNT_CREATION_DATA,
    data: fields,
  };
}

function clearCreationDataCreator(): AnyAction {
  return {
    type: CLEAR_ACCOUNT_CREATION_DATA,
    data: {},
  };
}

function updateStateCreator(state: Partial<AccountRequestState>): AnyAction {
  return {
    type: UPDATE_ACCOUNT_STATE,
    data: state,
  };
}

type LoginFields = {
  accountInfo: { username: string; password: string };
  device: { type: string; token: string | null; canNotify: boolean };
};

function loginCreator(fields: LoginFields): AppThunk<Promise<boolean>> {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        login: {
          loading: true,
          success: null,
          error: null,
          incorrect: null,
        },
      },
    });
    let result;
    try {
      result = await request('auth/login/local', 'post', fields, false, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          login: {
            success: false,
            loading: false,
            error: err,
            incorrect: null,
          },
        },
      });
      throw err;
    }
    if (!result?.data?.correct) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          login: {
            loading: false,
            success: null,
            error: null,
            incorrect: true,
          },
        },
      });
      return false;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
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
      type: LOGIN,
      data: result.data,
    });
    dispatch(fetchAccountCreator());
    dispatch(fetchGroupsCreator());
    dispatch(fetchWaitingGroupsCreator());
    logger.debug('Logged in');
    return true;
  };
}

type RegisterFields = {
  accountInfo: AccountCreationData;
  device: { type: string; token: string | null; canNotify: boolean };
};

function registerCreator(fields: RegisterFields): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        register: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request('auth/register/local', 'post', fields, false, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          register: {
            success: false,
            loading: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        register: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    dispatch({
      type: LOGIN,
      data: result.data,
    });
    dispatch(fetchAccountCreator());
    dispatch(fetchGroupsCreator());
    dispatch(fetchWaitingGroupsCreator());
    return true;
  };
}

function logoutCreator(): AnyAction {
  return {
    type: LOGOUT,
    data: {},
  };
}

function profileActionCreator(
  api: 'export/request' | 'delete/request',
  stateName: 'delete' | 'export',
): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        [stateName]: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(`profile/${api}`, 'post', {}, true, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          [stateName]: {
            loading: false,
            success: false,
            err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        [stateName]: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return result.data;
  };
}

function requestPasswordResetCreator({ username }: { username: string }): AppThunk {
  return async (dispatch, getState) => {
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        passwordRequest: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      await request('auth/password/request', 'post', { username }, false, 'auth');
    } catch (err) {
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          passwordRequest: {
            success: false,
            loading: false,
            error: err,
          },
        },
      });
      throw err;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        passwordRequest: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return true;
  };
}

function fetchNotificationsCreator(): AppThunk {
  return async (dispatch, getState) => {
    console.log('mushroom');
    if (!getState().account.loggedIn) {
      console.log('if');
      return null;
    }
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        notifications: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    console.log('hello1');
    let result;
    try {
      result = await request('notifications/get', 'get', {}, true, 'data');
    } catch (err) {
      console.log('hello2');
      dispatch({
        type: UPDATE_ACCOUNT_STATE,
        data: {
          notifications: {
            success: false,
            loading: false,
            error: err,
          },
        },
      });
      throw err;
    }
    console.log('Request done');
    console.log(result);
    dispatch({
      type: UPDATE_ACCOUNT_STATE,
      data: {
        notifications: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    dispatch({
      type: UPDATE_ACCOUNT_NOTIFICATIONS,
      data: result.data?.notifications,
    });
    return true;
  };
}

/* Actions */

function login(fields: LoginFields) {
  return Store.dispatch(loginCreator(fields));
}

function updateState(fields: {
  loading?: boolean | null;
  success?: boolean | null;
  error?: any;
  check?:
    | { success: boolean; error: any; loading: boolean }
    | { success: boolean; error: any; loading: boolean }
    | { loading: boolean; success: null; error: null };
}) {
  Store.dispatch(updateStateCreator(fields));
}

async function register(fields: RegisterFields) {
  await Store.dispatch(registerCreator(fields));
}

async function fetchEmail() {
  await Store.dispatch(fetchEmailCreator());
}

function logout() {
  Store.dispatch(logoutCreator());
}

function updateCreationData(params: Partial<AccountCreationData>) {
  Store.dispatch(updateCreationDataCreator(params));
}

function clearCreationData() {
  Store.dispatch(clearCreationDataCreator());
}

async function fetchGroups() {
  await Store.dispatch(fetchGroupsCreator());
}

async function fetchWaitingGroups() {
  await Store.dispatch(fetchWaitingGroupsCreator());
}

async function fetchAccount() {
  await Store.dispatch(fetchAccountCreator());
}

async function deleteAccount() {
  await Store.dispatch(profileActionCreator('delete/request', 'delete'));
}

async function exportAccount() {
  await Store.dispatch(profileActionCreator('export/request', 'export'));
}

async function requestPasswordReset(username: string) {
  await Store.dispatch(requestPasswordResetCreator({ username }));
}

async function fetchNotifications() {
  await Store.dispatch(fetchNotificationsCreator());
}

export {
  updateCreationData,
  clearCreationData,
  fetchGroups,
  fetchEmail,
  fetchWaitingGroups,
  fetchAccount,
  register,
  login,
  updateState,
  logout,
  deleteAccount,
  exportAccount,
  requestPasswordReset,
  fetchNotifications,
};
