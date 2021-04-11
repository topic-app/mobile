import {
  GroupsState,
  GroupsActionTypes,
  UPDATE_GROUPS_STATE,
  UPDATE_GROUPS_DATA,
  UPDATE_GROUPS_ITEM,
  UPDATE_GROUPS_SEARCH,
  UPDATE_GROUPS_TEMPLATES,
  UPDATE_GROUPS_VERIFICATION,
  CLEAR_GROUPS,
} from '@ts/redux';

const initialState: GroupsState = {
  data: [],
  search: [],
  verification: [],
  item: null,
  templates: [],
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
    templates: {
      success: null,
      error: null,
      loading: {
        initial: false,
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
    member_add: {
      success: null,
      error: null,
      loading: false,
    },
    member_delete: {
      success: null,
      error: null,
      loading: false,
    },
    member_accept: {
      success: null,
      error: null,
      loading: false,
    },
    member_modify: {
      success: null,
      error: null,
      loading: false,
    },
    member_reject: {
      success: null,
      error: null,
      loading: false,
    },
    member_leave: {
      success: null,
      error: null,
      loading: false,
    },
    modify: {
      success: null,
      error: null,
      loading: false,
    },
    verification_delete: {
      success: null,
      error: null,
      loading: false,
    },
  },
};

/**
 * @docs reducers
 * Reducer pour les groupes
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les groupes avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
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
    case UPDATE_GROUPS_VERIFICATION:
      return {
        ...state,
        verification: action.data,
      };
    case UPDATE_GROUPS_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case UPDATE_GROUPS_TEMPLATES:
      return {
        ...state,
        templates: action.data,
      };
    case CLEAR_GROUPS:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        templates: action.data.templates ? [] : state.templates,
        verification: action.data.verification ? [] : state.verification,
        item: action.data.item ? null : state.item,
        state: state.state,
      };
    default:
      return state;
  }
}

export default groupReducer;
