// @ts-nocheck
// TODO: Not implemented

const initialState = [];

/**
 * @docs reducers
 * Reducer pour les popups et notifications
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Stocker des messages, en supprimer un, supprimer tout
 * @returns Nouveau state
 */
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
