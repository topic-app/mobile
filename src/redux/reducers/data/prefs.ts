import { Config } from '@constants/index';
import { Preferences, PrefActionTypes, SET_PREFS, CLEAR_PREF, CLEAR_ALL_PREFS } from '@ts/types';
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

const initialState: Preferences = Config.defaults.preferences;

function prefReducer(state = initialState, action: PrefActionTypes) {
  const prefs = state;
  switch (action.type) {
    case SET_PREFS:
      return { ...prefs, ...action.data };
    case CLEAR_PREF:
      delete prefs[action.data];
      return prefs;
    case CLEAR_ALL_PREFS:
      return {};
    default:
      return state;
  }
}

export default prefReducer;
