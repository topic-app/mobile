import {
  DepartmentsState,
  DepartmentsActionTypes,
  UPDATE_DEPARTMENTS_STATE,
  UPDATE_DEPARTMENTS_DATA,
  UPDATE_DEPARTMENTS_ITEM,
  UPDATE_DEPARTMENTS_ITEMS,
  UPDATE_DEPARTMENTS_SEARCH,
  CLEAR_DEPARTMENTS,
} from '@ts/redux';

const initialState: DepartmentsState = {
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
 * Reducer pour les departments
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les departments avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function departmentReducer(state = initialState, action: DepartmentsActionTypes): DepartmentsState {
  switch (action.type) {
    case UPDATE_DEPARTMENTS_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_DEPARTMENTS_DATA:
      return {
        ...state,
        data: action.data,
      };
    case UPDATE_DEPARTMENTS_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_DEPARTMENTS_ITEMS:
      return {
        ...state,
        items: action.data,
      };
    case UPDATE_DEPARTMENTS_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case CLEAR_DEPARTMENTS:
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        items: action.data.items ? [] : state.items,
        item: null,
        state: state.state,
      };
    default:
      return state;
  }
}

export default departmentReducer;
