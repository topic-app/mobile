import {
  ArticlesState,
  ArticlesActionTypes,
  UPDATE_ARTICLES_STATE,
  UPDATE_ARTICLES_DATA,
  UPDATE_ARTICLES_ITEM,
  UPDATE_ARTICLES_VERIFICATION,
  UPDATE_ARTICLES_SEARCH,
  CLEAR_ARTICLES,
} from '@ts/redux';

const initialState: ArticlesState = {
  data: [],
  item: null,
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
    verification_info: {
      success: null,
      error: null,
      loading: false,
    },
  },
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
    case CLEAR_ARTICLES:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        verification: action.data.verification ? [] : state.verification,
        item: null,
        state: state.state,
      };
    default:
      return state;
  }
}

export default articleReducer;