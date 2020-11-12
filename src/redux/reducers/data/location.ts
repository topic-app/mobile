import { Config } from '@constants/index';
import {
  LocationList,
  LocationActionTypes,
  UPDATE_LOCATION,
  CLEAR_LOCATION,
  UPDATE_LOCATION_STATE,
} from '@ts/types';

const initialState: LocationList = {
  ...Config.defaults.location,
  state: {
    fetch: {
      loading: null,
      success: null,
      error: null,
    },
    update: {
      loading: null,
      success: null,
      error: null,
    },
  },
};

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
function locationReducer(state = initialState, action: LocationActionTypes) {
  switch (action.type) {
    case UPDATE_LOCATION:
      return { ...state, ...action.data };
    case CLEAR_LOCATION:
      return initialState;
    case UPDATE_LOCATION_STATE:
      return { ...state, state: { ...state.state, ...action.data } };
    default:
      return state;
  }
}

export default locationReducer;
