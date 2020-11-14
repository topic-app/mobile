import {
  PlacesState,
  PlacesActionTypes,
  UPDATE_PLACES_STATE,
  UPDATE_PLACES_DATA,
  UPDATE_PLACES_ITEM,
  UPDATE_PLACES_SEARCH,
  CLEAR_PLACES,
} from '@ts/redux';

const initialState: PlacesState = {
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
    near: {
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
  },
};

/**
 * @docs reducers
 * Reducer pour les places
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les places avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function placeReducer(state = initialState, action: PlacesActionTypes): PlacesState {
  switch (action.type) {
    case UPDATE_PLACES_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_PLACES_DATA:
      return {
        ...state,
        data: action.data,
      };
    case UPDATE_PLACES_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_PLACES_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case CLEAR_PLACES:
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

export default placeReducer;
