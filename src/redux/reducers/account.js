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

const initialState = {
  loggedIn: false,
  accountInfo: {},
  creationData: {},
  state: {
    loading: false,
    success: null,
    error: null,
    incorrect: null,
  },
};

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
    case 'LOGIN':
      return { loggedIn: true, accountInfo: action.data, creationData: {}, state: state.state };
    case 'LOGOUT':
      return { loggedIn: false, creationData: {}, state: state.state };
    default:
      return state;
  }
}

export default accountReducer;
