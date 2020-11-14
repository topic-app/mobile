import Store from '@redux/store';
import { Preferences, SET_PREFS } from '@ts/types';

/**
 * @docs actionCreators
 * Créateur d'action pour updatePrefsCreator
 * @param pref Les paramètres à mettre à jour
 * @awaits Action
 */
function updatePrefsCreator(prefs: Partial<Preferences>) {
  return {
    type: SET_PREFS,
    data: prefs,
  };
}

/**
 * @docs actions
 * Mettre à jour un ou plusieurs paramètres
 * @param prefs les paramètres à mettre à jour
 */
async function updatePrefs(prefs: Partial<Preferences>) {
  await Store.dispatch(updatePrefsCreator(prefs));
}

export { updatePrefs };
export default updatePrefs;
