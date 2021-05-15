import {
  SchoolsState,
  SchoolsActionTypes,
  UPDATE_SCHOOLS_STATE,
  UPDATE_SCHOOLS_DATA,
  UPDATE_SCHOOLS_ITEM,
  UPDATE_SCHOOLS_ITEMS,
  UPDATE_SCHOOLS_SEARCH,
  UPDATE_SCHOOLS_NEAR,
  CLEAR_SCHOOLS,
} from '@ts/redux';

const initialState: SchoolsState = {
  data: [],
  search: [],
  near: [],
  item: null,
  items: [],
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
    near: {
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
 * Reducer pour les schools
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les schools avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function schoolReducer(state = initialState, action: SchoolsActionTypes): SchoolsState {
  switch (action.type) {
    case UPDATE_SCHOOLS_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_SCHOOLS_DATA:
      return {
        ...state,
        data: action.data,
      };
    case UPDATE_SCHOOLS_NEAR:
      return {
        ...state,
        near: action.data,
      };
    case UPDATE_SCHOOLS_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_SCHOOLS_ITEMS:
      return {
        ...state,
        items: action.data,
      };
    case UPDATE_SCHOOLS_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case CLEAR_SCHOOLS:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        near: action.data.near ? [] : state.near,
        item: action.data.item ? null : state.item,
        items: [],
        state: state.state,
      };
    default:
      return state;
  }
}

export default schoolReducer;
