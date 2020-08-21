import {
  GroupsState,
  GroupsActionTypes,
  UPDATE_GROUPS_STATE,
  UPDATE_GROUPS_DATA,
  UPDATE_GROUPS_ITEM,
  UPDATE_GROUPS_SEARCH,
  CLEAR_GROUPS,
} from '@ts/redux';

const initialState: GroupsState = {
  data: [],
  search: [],
  item: null,
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
    follow: {
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
 * Reducer pour les groups
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les groups avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function groupReducer(state = initialState, action: GroupsActionTypes): GroupsState {
  switch (action.type) {
    case UPDATE_GROUPS_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_GROUPS_DATA:
      return {
        ...state,
        data: action.data,
      };
    case UPDATE_GROUPS_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_GROUPS_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case CLEAR_GROUPS:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        item: null,
        state: state.state,
      };
    default:
      return state;
  }
}

export default groupReducer;