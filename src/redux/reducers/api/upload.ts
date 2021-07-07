import { UploadState, UploadActionTypes, UPDATE_UPLOAD_STATE, FULL_CLEAR } from '@ts/redux';

const initialState: UploadState = {
  state: {
    upload: {
      loading: false,
      success: null,
      error: null,
    },
    permission: {
      loading: false,
      success: null,
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
function uploadReducer(state = initialState, action: UploadActionTypes): UploadState {
  switch (action.type) {
    case UPDATE_UPLOAD_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case FULL_CLEAR:
      return initialState;
    default:
      return state;
  }
}

export default uploadReducer;
