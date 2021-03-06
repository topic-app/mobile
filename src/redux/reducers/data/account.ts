import _ from 'lodash';

import { Config } from '@constants';
import {
  LOGOUT,
  LOGIN,
  UPDATE_ACCOUNT_USER,
  UPDATE_ACCOUNT_PERMISSIONS,
  CLEAR_ACCOUNT_CREATION_DATA,
  UPDATE_ACCOUNT_STATE,
  UPDATE_ACCOUNT_GROUPS,
  UPDATE_ACCOUNT_WAITING_GROUPS,
  UPDATE_ACCOUNT_NOTIFICATIONS,
  UPDATE_ACCOUNT_CREATION_DATA,
  UPDATE_ACCOUNT_EMAIL,
  AccountActionTypes,
  AccountState,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: AccountState = {
  ...(_.isEmpty(Config.seedDb.account)
    ? (Config.seedDb.account as AccountState)
    : {
        loggedIn: false,
        accountInfo: null,
        creationData: {},
      }),
  permissions: [],
  groups: [],
  waitingGroups: [],
  notifications: [],
  state: {
    login: {
      loading: false,
      success: null,
      error: null,
      incorrect: null,
    },
    passwordRequest: {
      loading: false,
      success: null,
      error: null,
    },
    passwordReset: {
      loading: false,
      success: null,
      error: null,
    },
    register: {
      loading: false,
      success: null,
      error: null,
    },
    check: {
      loading: false,
      success: null,
      error: null,
    },
    fetchGroups: {
      loading: false,
      success: null,
      error: null,
    },
    fetchEmail: {
      loading: false,
      success: null,
      error: null,
    },
    fetchWaitingGroups: {
      loading: false,
      success: null,
      error: null,
    },
    fetchAccount: {
      loading: false,
      success: null,
      error: null,
    },
    updateToken: {
      loading: false,
      success: null,
      error: null,
    },
    updateProfile: {
      loading: false,
      success: null,
      error: null,
    },
    delete: {
      loading: false,
      success: null,
      error: null,
    },
    export: {
      loading: false,
      success: null,
      error: null,
    },
    resend: {
      loading: false,
      success: null,
      error: null,
    },
    notifications: {
      loading: false,
      success: null,
      error: null,
    },
  },
};

/**
 * @docs reducers
 * Reducer pour le compte
 * @param state Contient le contenu de la database redux
 * @param action.type Mettre ?? jour les donn??es de cr??ation de compte,
 *                    mettre ?? jour les permissions, etc
 * @returns Nouveau state
 */
function accountReducer(state = initialState, action: AccountActionTypes): AccountState {
  switch (action.type) {
    case UPDATE_ACCOUNT_CREATION_DATA:
      return {
        ...state,
        creationData: { ...state.creationData, ...action.data },
      };
    case CLEAR_ACCOUNT_CREATION_DATA:
      return {
        ...state,
        creationData: {},
      };
    case UPDATE_ACCOUNT_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_ACCOUNT_GROUPS:
      if (state.loggedIn) {
        return {
          ...state,
          groups: action.data,
        };
      }
      console.warn('accountReducer: Attempted to update account groups while not logged in');
      return state;
    case UPDATE_ACCOUNT_NOTIFICATIONS:
      if (state.loggedIn) {
        return {
          ...state,
          notifications: action.data,
        };
      }
      console.warn(
        'accountReducer: Attempted to update account waiting groups while not logged in',
      );
      return state;
    case UPDATE_ACCOUNT_WAITING_GROUPS:
      if (state.loggedIn) {
        return {
          ...state,
          waitingGroups: action.data,
        };
      }
      console.warn(
        'accountReducer: Attempted to update account waiting groups while not logged in',
      );
      return state;
    case UPDATE_ACCOUNT_PERMISSIONS:
      if (state.loggedIn) {
        return {
          ...state,
          permissions: action.data,
        };
      }
      console.warn('accountReducer: Attempted to update account permissions while not logged in');
      return state;
    case UPDATE_ACCOUNT_USER:
      if (state.loggedIn) {
        return {
          ...state,
          accountInfo: { ...state.accountInfo, user: action.data },
        };
      }
      console.warn('accountReducer: Attempted to update accountInfo while not logged in');
      return state;
    case UPDATE_ACCOUNT_EMAIL:
      if (state.loggedIn) {
        return {
          ...state,
          accountInfo: { ...state.accountInfo, email: action.data },
        };
      }
      console.warn('accountReducer: Attempted to update email while not logged in');
      return state;
    case LOGIN:
      return {
        loggedIn: true,
        accountInfo: action.data.accountInfo,
        creationData: {},
        state: state.state,
        permissions: [],
        groups: [],
        waitingGroups: [],
        notifications: [],
      };
    case FULL_CLEAR:
      return initialState;
    case LOGOUT:
      return {
        loggedIn: false,
        accountInfo: null,
        creationData: {},
        permissions: [],
        groups: [],
        waitingGroups: [],
        state: state.state,
        notifications: [],
      };
    default:
      return state;
  }
}

export default accountReducer;
