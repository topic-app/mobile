import { request } from '@utils/index';
import Store from '@redux/store';
import { config } from '@root/app.json';

import {
  GroupRolePermission,
  GroupRole,
  SchoolPreload,
  DepartmentPreload,
  Avatar,
} from '@ts/types';
import crypto from 'react-native-simple-crypto';

function fetchGroupsCreator() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
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

function fetchAccountCreator() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
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
        let hashedPassword = await crypto.PBKDF2.hash(
          crypto.utils.convertUtf8ToArrayBuffer(fields.accountInfo.password),
          crypto.utils.convertUtf8ToArrayBuffer(config.auth.salt),
          config.auth.iterations,
          config.auth.keylen,
          config.auth.digest,
        );
        fields.accountInfo.password = crypto.utils.convertArrayBufferToHex(hashedPassword);
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
          Store.dispatch(fetchAccountCreator());
          Store.dispatch(fetchGroupsCreator());
          console.log('LoggedIn');
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
        // We also hash passwords on the server, this is just a small extra security
        let hashedPassword = await crypto.PBKDF2.hash(
          crypto.utils.convertUtf8ToArrayBuffer(fields.accountInfo.password),
          crypto.utils.convertUtf8ToArrayBuffer(config.auth.salt),
          config.auth.iterations,
          config.auth.keylen,
          config.auth.digest,
        );
        fields.accountInfo.password = crypto.utils.convertArrayBufferToHex(hashedPassword);
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

async function fetchAccount() {
  await Store.dispatch(fetchAccountCreator());
}

export {
  updateCreationData,
  clearCreationData,
  fetchGroups,
  fetchAccount,
  register,
  login,
  updateState,
  logout,
};
