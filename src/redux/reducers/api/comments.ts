import {
  CommentsState,
  CommentsActionTypes,
  UPDATE_COMMENTS_STATE,
  UPDATE_COMMENTS_DATA,
  UPDATE_COMMENTS_VERIFICATION,
  CLEAR_COMMENTS,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: CommentsState = {
  data: [],
  search: [],
  verification: [],
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
    verification_list: {
      success: null,
      error: null,
      loading: {
        initial: false,
        refresh: false,
        next: false,
      },
    },
    search: {
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
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les comments avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
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
    case UPDATE_COMMENTS_VERIFICATION:
      return {
        ...state,
        verification: action.data,
      };
    case FULL_CLEAR:
      return initialState;
    case CLEAR_COMMENTS:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        verification: action.data.verification ? [] : state.verification,
        state: state.state,
      };
    default:
      return state;
  }
}

export default commentReducer;
