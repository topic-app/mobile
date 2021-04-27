import { LinkingState, LinkingActionTypes, UPDATE_LINKING_STATE } from '@ts/redux';

const initialState: LinkingState = {
  state: {
    emailChange: {
      loading: false,
      success: null,
      error: null,
    },
    emailVerify: {
      loading: false,
      success: null,
      error: null,
    },
    accountDelete: {
      loading: false,
      success: null,
      error: null,
    },
    resetPassword: {
      loading: false,
      success: null,
      error: null,
    },
    feedback: {
      loading: false,
      success: false,
      error: null,
    },
  },
};

/**
 * @docs reducers
 * Reducer pour les articles
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les articles avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function linkingReducer(state = initialState, action: LinkingActionTypes): LinkingState {
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
