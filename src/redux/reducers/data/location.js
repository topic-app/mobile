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
if (config.dev.defaultLocation) {
  initialState = config.dev.defaultLocation;
} else {
  initialState = {
    selected: false,
    schools: [],
    schoolData: [],
    departments: [],
    departmentData: [],
    global: null,
    state: {
      loading: null,
      success: null,
      error: null,
    },
  };
}

function locationReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LOCATION':
      return { ...state, ...action.data };
    case 'CLEAR_LOCATION':
      return initialState;
    case 'UPDATE_LOCATION_STATE':
      return { ...state, state: action.data };
    default:
      return state;
  }
}

export default locationReducer;
