import { Config } from '@constants/index';
import {
  Account,
  LOGOUT,
  LOGIN,
  UPDATE_ACCOUNT_USER,
  UPDATE_ACCOUNT_PERMISSIONS,
  CLEAR_ACCOUNT_CREATION_DATA,
  UPDATE_ACCOUNT_STATE,
  UPDATE_ACCOUNT_GROUPS,
  UPDATE_ACCOUNT_WAITING_GROUPS,
  UPDATE_ACCOUNT_CREATION_DATA,
  AccountActionTypes,
} from '@ts/types';
/**
 * @docs reducers
 * Reducer pour les preferences
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['SET_PREF', 'CLEAR_PREF', 'CLEAR_ALL_PREFS'] Stocker des parametres, en supprimer un, supprimer tout
 * @param {object} action.data.prefs Les parametres à stocker
 * @param {string} action.data.pref La clé du paramètre à supprimer
 * @returns Nouveau state
 */

const initialState: Account = {
  ...Config.defaults.account,
  groups: [],
  creationData: {},
  waitingGroups: [],
  permissions: [],
  state: {
    login: {
      loading: false,
      success: null,
      error: null,
      incorrect: null,
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
    updateProfile: {
      loading: false,
      success: null,
      error: null,
    },
  },
};

function accountReducer(state = initialState, action: AccountActionTypes) {
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
      return {
        ...state,
        groups: action.data,
      };
    case UPDATE_ACCOUNT_WAITING_GROUPS:
      return {
        ...state,
        waitingGroups: action.data,
      };
    case UPDATE_ACCOUNT_PERMISSIONS:
      return {
        ...state,
        permissions: action.data,
      };
    case UPDATE_ACCOUNT_USER:
      return {
        ...state,
        accountInfo: { ...state.accountInfo, user: action.data },
      };
    case LOGIN:
      return {
        loggedIn: true,
        accountInfo: action.data.accountInfo,
        creationData: {},
        state: state.state,
        permissions: [],
        groups: [],
        waitingGroups: [],
      };
    case LOGOUT:
      return {
        loggedIn: false,
        accountInfo: null,
        permissions: [],
        groups: [],
        waitingGroups: [],
        creationData: {},
        state: state.state,
      };
    default:
      return state;
  }
}

export default accountReducer;
