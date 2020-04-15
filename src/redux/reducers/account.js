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
 }

function accountReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { loggedIn: true, accountInfo: action.data };
    case 'LOGOUT':
      return { loggedIn: false };
    default:
      return state;
  }
}

export default accountReducer;
