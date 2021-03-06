import {
  TagsState,
  TagsActionTypes,
  UPDATE_TAGS_STATE,
  UPDATE_TAGS_DATA,
  UPDATE_TAGS_ITEM,
  UPDATE_TAGS_SEARCH,
  CLEAR_TAGS,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: TagsState = {
  data: [],
  item: null,
  items: [],
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
    search: {
      success: null,
      error: null,
      loading: {
        initial: false,
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
  },
};

/**
 * @docs reducers
 * Reducer pour les tags
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les tags avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function tagReducer(state = initialState, action: TagsActionTypes): TagsState {
  switch (action.type) {
    case UPDATE_TAGS_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_TAGS_DATA:
      return {
        ...state,
        data: action.data,
      };
    case UPDATE_TAGS_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_TAGS_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case FULL_CLEAR:
      return initialState;
    case CLEAR_TAGS:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        item: action.data.item ? null : state.item,
        items: action.data.item ? [] : state.items,
        state: state.state,
      };
    default:
      return state;
  }
}

export default tagReducer;
