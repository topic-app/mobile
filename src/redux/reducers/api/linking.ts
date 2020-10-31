import { LinkingState, LinkingActionType, UPDATE_LINKING_STATE } from '@ts/redux';

const initialState: LinkingState = {
  state: {},
};

/**
 * @docs reducers
 * Reducer pour les articles
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les articles avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function linkingReducer(state = initialState, action: LinkingActionType): LinkingState {
  switch (action.type) {
    case UPDATE_LINKING_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    default:
      return state;
  }
}

export default linkingReducer;
