import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updatePrefsCreator
 * @param pref Les paramètres à mettre à jour
 * @awaits Action
 */
function updateMessagesCreator(messages) {
  return {
    type: 'SET_MESSAGES',
    data: messages,
  };
}

/**
 * @docs actions
 * Mettre à jour un ou plusieurs paramètres
 * @param prefs les paramètres à mettre à jour
 */
async function updateMessages(messages) {
  await Store.dispatch(updateMessagesCreator(messages));
}

export { updateMessages };
export default updateMessages;
