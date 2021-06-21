import { Config } from '@constants';
import {
  LocationActionTypes,
  UPDATE_LOCATION,
  CLEAR_LOCATION,
  UPDATE_LOCATION_STATE,
  LocationState,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: LocationState = {
  selected: false,
  schools: [],
  schoolData: [],
  departments: [],
  departmentData: [],
  global: false,
  state: {
    fetch: {
      loading: false,
      success: null,
      error: null,
    },
    update: {
      loading: false,
      success: null,
      error: null,
    },
  },
  ...Config.seedDb.location,
};

/**
 * @docs reducers
 * Reducer pour les preferences
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Stocker des parametres, en supprimer un, supprimer tout
 * @param action.data.prefs Les parametres à stocker
 * @param action.data.pref La clé du paramètre à supprimer
 * @returns Nouveau state
 */
function locationReducer(state = initialState, action: LocationActionTypes): LocationState {
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
