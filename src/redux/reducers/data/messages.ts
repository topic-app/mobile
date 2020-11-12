// @ts-nocheck
// TODO: Not implemented

/**
 * @docs reducers
 * Reducer pour les popups et notifications
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['SET_PREF', 'CLEAR_PREF', 'CLEAR_ALL_PREFS'] Stocker des parametres, en supprimer un, supprimer tout
 * @param {object} action.data.prefs Les parametres à stocker
 * @param {string} action.data.pref La clé du paramètre à supprimer
 * @returns Nouveau state
 */

const initialState = [];

function messageReducer(state = initialState, action) {
  const messages = state;
  switch (action.type) {
    case 'SET_MESSAGES':
      action.data.forEach((m) => {
        if (messages.find((n) => n.id === m.id)) {
          messages[messages.index((n) => n.id === m.id)] = m;
        } else {
          messages.push(m);
        }
      });
      return { ...messages, ...action.data };
    case 'CLEAR_MESSAGE':
      delete messages[messages.index((m) => m.id === action.data)];
      return messages;
    case 'CLEAR_ALL_MESSAGES':
      return [];
    default:
      return state;
  }
}

export default messageReducer;
