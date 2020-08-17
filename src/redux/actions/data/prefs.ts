import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updatePrefsCreator
 * @param pref Les paramètres à mettre à jour
 * @awaits Action
 */
function updatePrefsCreator(prefs) {
  return {
    type: 'SET_PREFS',
    data: prefs,
  };
}

/**
 * @docs actions
 * Mettre à jour un ou plusieurs paramètres
 * @param prefs les paramètres à mettre à jour
 */
async function updatePrefs(prefs) {
  await Store.dispatch(updatePrefsCreator(prefs));
}

export { updatePrefs };
export default updatePrefs;
