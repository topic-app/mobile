import {
  PetitionsState,
  PetitionsActionTypes,
  UPDATE_PETITIONS_STATE,
  UPDATE_PETITIONS_DATA,
  UPDATE_PETITIONS_ITEM,
  UPDATE_PETITIONS_SEARCH,
  CLEAR_PETITIONS,
} from '@ts/redux';

const initialState: PetitionsState = {
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
  },
};

/**
 * @docs reducers
 * Reducer pour les petitions
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les petitions avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function petitionReducer(state = initialState, action: PetitionsActionTypes): PetitionsState {
  switch (action.type) {
    case UPDATE_PETITIONS_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_PETITIONS_DATA:
      return {
        ...state,
        data: action.data,
      };
    case UPDATE_PETITIONS_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_PETITIONS_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case CLEAR_PETITIONS:
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

export default petitionReducer;
