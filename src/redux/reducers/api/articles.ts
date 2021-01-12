import {
  ArticlesState,
  ArticlesActionTypes,
  UPDATE_ARTICLES_STATE,
  UPDATE_ARTICLES_DATA,
  UPDATE_ARTICLES_FOLLOWING,
  UPDATE_ARTICLES_ITEM,
  UPDATE_ARTICLES_VERIFICATION,
  UPDATE_ARTICLES_SEARCH,
  CLEAR_ARTICLES,
  UPDATE_ARTICLES_MY_INFO,
} from '@ts/redux';

const initialState: ArticlesState = {
  data: [],
  following: [],
  item: null,
  my: null,
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
    following: {
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
    info: {
      success: null,
      error: null,
      loading: false,
    },
    my: {
      success: null,
      error: null,
      loading: false,
    },
    like: {
      success: null,
      error: null,
      loading: false,
    },
    report: {
      success: null,
      error: null,
      loading: false,
    },
    add: {
      success: null,
      error: null,
      loading: false,
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
    verification_approve: {
      success: null,
      error: null,
      loading: false,
    },
    delete: {
      success: null,
      error: null,
      loading: false,
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
function articleReducer(state = initialState, action: ArticlesActionTypes): ArticlesState {
  switch (action.type) {
    case UPDATE_ARTICLES_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_ARTICLES_DATA:
      return {
        ...state,
        data: action.data,
      };
    case UPDATE_ARTICLES_FOLLOWING:
      return {
        ...state,
        following: action.data,
      };
    case UPDATE_ARTICLES_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_ARTICLES_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case UPDATE_ARTICLES_VERIFICATION:
      return {
        ...state,
        verification: action.data,
      };
    case UPDATE_ARTICLES_MY_INFO:
      return {
        ...state,
        my: action.data,
      };
    case CLEAR_ARTICLES:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        following: action.data.following ? [] : state.following,
        verification: action.data.verification ? [] : state.verification,
        item: null,
        my: null,
        state: state.state,
      };
    default:
      return state;
  }
}

export default articleReducer;
