import {
  PlacesState,
  PlacesActionTypes,
  UPDATE_PLACES_STATE,
  UPDATE_PLACES_DATA,
  UPDATE_PLACES_ITEM,
  UPDATE_PLACES_SEARCH,
  CLEAR_PLACES,
  UPDATE_PLACES_MAP_DATA,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: PlacesState = {
  data: [],
  mapData: [],
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
    map: {
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
    case UPDATE_PLACES_MAP_DATA:
      return {
        ...state,
        mapData: action.data,
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
    case FULL_CLEAR:
      return initialState;
    case CLEAR_PLACES:
      return {
        data: action.data.data ? [] : state.data,
        mapData: action.data.mapData ? [] : state.mapData,
        search: action.data.search ? [] : state.search,
        item: action.data.item ? null : state.item,
        state: state.state,
      };
    default:
      return state;
  }
}

export default placeReducer;
