import { AnyAction } from 'redux';
import { request, logger } from '@utils/index';
import Store from '@redux/store';

import {
  GroupRolePermission,
  GroupRole,
  SchoolPreload,
  DepartmentPreload,
  Avatar,
  GroupWithMembership,
  UPDATE_ACCOUNT_GROUPS,
  UPDATE_ACCOUNT_PERMISSIONS,
  UPDATE_ACCOUNT_STATE,
  UPDATE_ACCOUNT_WAITING_GROUPS,
  LOGOUT,
  UPDATE_ACCOUNT_USER,
  UPDATE_LOCATION,
  UPDATE_ACCOUNT_CREATION_DATA,
  CLEAR_ACCOUNT_CREATION_DATA,
  LOGIN,
  AccountRequestState,
  AppThunk,
} from '@ts/types';
import { hashPassword } from '@utils/crypto';

import { fetchLocationData } from './location';

function fetchGroupsCreator(): AppThunk {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (!getState().account.loggedIn) {
        dispatch({
          type: UPDATE_ACCOUNT_GROUPS,
          data: [],
        });
        dispatch({
          type: UPDATE_ACCOUNT_PERMISSIONS,
          data: [],
        });
        return resolve();
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
      request('groups/my', 'get', {}, true)
        .then((result) => {
          // TODO: This really needs tested
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
          resolve();
        })
        .catch((err) => {
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
          reject();
        });
    });
  };
}

function fetchWaitingGroupsCreator(): AppThunk {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (!getState().account.loggedIn) {
        dispatch({
          type: UPDATE_ACCOUNT_WAITING_GROUPS,
          data: [],
        });
        return resolve();
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
      request('groups/members/waiting', 'get', {}, true)
        .then((result) => {
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
          resolve();
        })
        .catch((err) => {
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
          reject();
        });
    });
  };
}

function fetchAccountCreator(): AppThunk {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (!getState().account.loggedIn) {
        dispatch({
          type: LOGOUT,
          data: null,
        });
        return resolve();
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
      request('profile/info', 'get', {}, true)
        .then((result) => {
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
          const location = result.data?.profile[0]?.data?.location;
          const data = {
            schools: location.schools.map((l: SchoolPreload) => l._id),
            departments: location.departments.map((l: DepartmentPreload) => l._id),
            global: location.global,
          };
          dispatch({
            type: UPDATE_LOCATION,
            data,
          });
          fetchLocationData();
          resolve();
        })
        .catch((err) => {
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
          reject();
        });
    });
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
  device: { type: string; deviceId: null; canNotify: boolean };
};

function loginCreator(fields: LoginFields): AppThunk {
  return async (dispatch) => {
    const newFields = fields;
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
    try {
      // We also hash passwords on the server, this is just a small extra security
      newFields.accountInfo.password = await hashPassword(newFields.accountInfo.password);
    } catch (err) {
      return dispatch({
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
    }
    request('auth/login/local', 'post', newFields)
      .then((result) => {
        if (!result.data?.correct) {
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
          return Promise.reject();
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
        return Promise.resolve();
      })
      .catch((err) => {
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
        return Promise.reject();
      });
  };
}

type RegisterFields = {
  accountInfo: {
    username: string;
    email: string;
    password: string;
    global: boolean;
    schools: string[];
    departments: string[];
    avatar: Avatar;
    description: string;
    public: boolean;
    firstName: string;
    lastName: string;
  };
  device: { type: string; deviceId: null; canNotify: boolean };
};

function registerCreator(fields: RegisterFields): AppThunk {
  return async (dispatch) => {
    const newFields = fields;
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
    try {
      newFields.accountInfo.password = await hashPassword(newFields.accountInfo.password);
    } catch (err) {
      return dispatch({
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
    }
    request('auth/register/local', 'post', newFields)
      .then((result) => {
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
        return Promise.resolve();
      })
      .catch((err) => {
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
        return Promise.reject(err);
      });
  };
}

function logoutCreator(): AnyAction {
  return {
    type: LOGOUT,
    data: {},
  };
}

/* Actions */

async function login(fields: LoginFields) {
  await Store.dispatch(loginCreator(fields));
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

function logout() {
  Store.dispatch(logoutCreator());
}

function updateCreationData(params: {
  title?: string;
  email?: string;
  password?: string;
  username?: string;
  schools?: string[];
  departments?: string;
  global?: boolean;
  accountType?: string;
  firstName?: string;
  lastName?: string;
  avatar?: Avatar;
}) {
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

export {
  updateCreationData,
  clearCreationData,
  fetchGroups,
  fetchWaitingGroups,
  fetchAccount,
  register,
  login,
  updateState,
  logout,
};
