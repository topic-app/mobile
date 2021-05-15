import { Config } from '@constants';
import {
  PrefActionTypes,
  SET_PREFS,
  CLEAR_PREF,
  CLEAR_ALL_PREFS,
  PreferencesState,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: PreferencesState = {
  theme: 'light',
  useSystemTheme: true,
  history: true,
  recommendations: false,
  syncHistory: true,
  syncLists: true,
  fontSize: 14,
  fontFamily: 'system',
  stripFormatting: false,
  themeEasterEggDiscovered: false,
  youtubeConsent: false,
  useDevServer: !!__DEV__,
  analytics: true,
  completedFeedback: [],
  appOpens: 0,
  reduxVersion: Config.reduxVersion,
  showDownloadBanner: !__DEV__,
  advancedMode: !!__DEV__,
  ...Config.seedDb.preferences,
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
function prefReducer(state = initialState, action: PrefActionTypes): PreferencesState {
  const prefs = state;
  switch (action.type) {
    case SET_PREFS:
      return { ...prefs, ...action.data };
    case CLEAR_PREF:
      return {
        ...prefs,
        // Reset preference to default
        [action.data]: initialState[action.data],
      };
    case CLEAR_ALL_PREFS:
      // Return the default preferences
      return initialState;
    case FULL_CLEAR:
      return { ...initialState, useDevServer: state.useDevServer };
    default:
      return state;
  }
}

export default prefReducer;
