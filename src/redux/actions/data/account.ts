import { request, logger } from '@utils/index';
import Store from '@redux/store';
import { fetchLocationData } from './location';

import {
  GroupRolePermission,
  GroupRole,
  SchoolPreload,
  DepartmentPreload,
  Avatar,
} from '@ts/types';
import { hashPassword } from '@utils/crypto';

function fetchGroupsCreator() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (!getState().account.loggedIn) {
        dispatch({
          type: 'UPDATE_ACCOUNT_GROUPS',
          data: [],
        });
        dispatch({
          type: 'UPDATE_ACCOUNT_PERMISSIONS',
          data: [],
        });
        return resolve();
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
      request('groups/my', 'get', {}, true)
        .then((result) => {
          // TODO: This really needs tested
          let permissions: GroupRolePermission[] = [];
          result.data?.groups?.forEach((g) => {
            const user = g?.membership;
            const userMainPermissions = g?.roles?.find((r) => r._id === user?.role)?.permissions;
            permissions = [
              ...permissions,
              userMainPermissions?.map((p) => {
                return { ...p, group: g._id };
              }),
            ];
            const userSecondaryPermissions = g?.roles
              .filter((r: GroupRole) => user?.secondaryRoles?.includes(r._id))
              .map((i: GroupRole) => i?.permissions)
              .flat();
            permissions = [
              ...permissions,
              userSecondaryPermissions?.map((p: GroupRolePermission) => {
                return { ...p, group: g._id };
              }),
            ];
          });
          permissions = permissions.flat();
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
            data: result.data?.groups,
          });
          dispatch({
            type: 'UPDATE_ACCOUNT_PERMISSIONS',
            data: permissions,
          });
          resolve();
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
          reject();
        });
    });
  };
}

function fetchWaitingGroupsCreator() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (!getState().account.loggedIn) {
        dispatch({
          type: 'UPDATE_ACCOUNT_WAITING_GROUPS',
          data: [],
        });
        return resolve();
      }
      dispatch({
        type: 'UPDATE_ACCOUNT_STATE',
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
            type: 'UPDATE_ACCOUNT_WAITING_GROUPS',
            data: result.data?.groups,
          });
          dispatch({
            type: 'UPDATE_ACCOUNT_STATE',
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
            type: 'UPDATE_ACCOUNT_STATE',
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

function fetchAccountCreator() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (!getState().account.loggedIn) {
        dispatch({
          type: 'LOGOUT',
          data: null,
        });
        return resolve();
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
      request('profile/info', 'get', {}, true)
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
            data: result.data?.profile[0], // TEMP: This should change on server
          });
          const location = result.data?.profile[0]?.data?.location;
          const data = {
            schools: location.schools.map((l: SchoolPreload) => l._id),
            departments: location.departments.map((l: DepartmentPreload) => l._id),
            global: location.global,
          };
          dispatch({
            type: 'UPDATE_LOCATION',
            data,
          });
          fetchLocationData();
          resolve();
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
          reject();
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

type LoginFields = {
  accountInfo: { username: string; password: string };
  device: { type: string; deviceId: null; canNotify: boolean };
};

function loginCreator(fields: LoginFields) {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
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
      try {
        // We also hash passwords on the server, this is just a small extra security
        fields.accountInfo.password = await hashPassword(fields.accountInfo.password);
      } catch (err) {
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
      }
      request('auth/login/local', 'post', fields)
        .then((result) => {
          if (!result.data?.correct) {
            dispatch({
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
            return reject();
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
          dispatch(fetchAccountCreator());
          dispatch(fetchGroupsCreator());
          dispatch(fetchWaitingGroupsCreator());
          logger.debug('Logged in');
          resolve();
        })
        .catch((err) => {
          dispatch({
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
          reject();
        });
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

function registerCreator(fields: RegisterFields) {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
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
      try {
        fields.accountInfo.password = await hashPassword(fields.accountInfo.password);
      } catch (err) {
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
      }
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
          dispatch(fetchAccountCreator());
          dispatch(fetchGroupsCreator());
          dispatch(fetchWaitingGroupsCreator());
          resolve();
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_ACCOUNT_STATE',
            data: {
              register: {
                success: false,
                loading: false,
                error: err,
              },
            },
          });
          reject(err);
        });
    });
  };
}

function logoutCreator() {
  return {
    type: 'LOGOUT',
    data: {},
  };
}

/* Actions */

async function login(fields: LoginFields) {
  await Store.dispatch(loginCreator(fields));
}

async function updateState(fields: {
  loading?: boolean | null;
  success?: boolean | null;
  error?: any;
  check?:
    | { success: boolean; error: any; loading: boolean }
    | { success: boolean; error: any; loading: boolean }
    | { loading: boolean; success: null; error: null };
}) {
  await Store.dispatch(updateStateCreator(fields));
}

async function register(fields: RegisterFields) {
  await Store.dispatch(registerCreator(fields));
}

async function logout() {
  Store.dispatch(logoutCreator());
}

async function updateCreationData(params: {
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
  await Store.dispatch(updateCreationDataCreator(params));
}

async function clearCreationData() {
  await Store.dispatch(clearCreationDataCreator());
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
