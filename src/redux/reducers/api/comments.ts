import {
  CommentsState,
  CommentsActionTypes,
  UPDATE_COMMENTS_STATE,
  UPDATE_COMMENTS_DATA,
  CLEAR_COMMENTS,
} from '@ts/redux';

const initialState: CommentsState = {
  data: [],
  search: [],
  state: {
    list: {
      success: null,
      error: null,
      loading: {
        initial: false,
        refresh: false,
        next: false,
      },
    },
    add: {
      success: null,
      error: null,
      loading: false,
    },
    report: {
      success: null,
      error: null,
      loading: false,
    },
  },
};

/**
 * @docs reducers
 * Reducer pour les comments
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les comments avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function commentReducer(state = initialState, action: CommentsActionTypes): CommentsState {
  switch (action.type) {
    case UPDATE_COMMENTS_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_COMMENTS_DATA:
      return {
        ...state,
        data: action.data,
      };
    case CLEAR_COMMENTS:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        state: state.state,
      };
    default:
      return state;
  }
}

export default commentReducer;
