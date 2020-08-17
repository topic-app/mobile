import { config } from '@root/app.json';
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

let initialState;

if (config.dev.defaultAccount) {
  initialState = {
    ...config.dev.defaultAccount,
    groups: [],
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
} else {
  initialState = {
    loggedIn: false,
    accountInfo: {},
    creationData: {},
    groups: [],
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
}

function accountReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CREATION_DATA':
      return {
        ...state,
        creationData: { ...state.creationData, ...action.data },
      };
    case 'CLEAR_CREATION_DATA':
      return {
        ...state,
        creationData: {},
      };
    case 'UPDATE_ACCOUNT_STATE':
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case 'UPDATE_ACCOUNT_GROUPS':
      return {
        ...state,
        groups: action.data,
      };
    case 'UPDATE_ACCOUNT_PERMISSIONS':
      return {
        ...state,
        permissions: action.data,
      };
    case 'UPDATE_ACCOUNT_USER':
      return {
        ...state,
        accountInfo: { ...state.accountInfo, user: action.data },
      };
    case 'LOGIN':
      return {
        loggedIn: true,
        accountInfo: action.data.accountInfo,
        creationData: {},
        state: state.state,
      };
    case 'LOGOUT':
      return { loggedIn: false, accountInfo: {}, creationData: {}, state: state.state };
    default:
      return state;
  }
}

export default accountReducer;
