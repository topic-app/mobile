import {
  EventsState,
  EventsActionTypes,
  UPDATE_EVENTS_STATE,
  UPDATE_EVENTS_UPCOMING_DATA,
  UPDATE_EVENTS_PASSED_DATA,
  UPDATE_EVENTS_ITEM,
  UPDATE_EVENTS_SEARCH,
  CLEAR_EVENTS,
} from '@ts/redux';

const initialState: EventsState = {
  dataUpcoming: [],
  dataPassed: [],
  verification: [],
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
 * Reducer pour les events
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les events avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function eventReducer(state = initialState, action: EventsActionTypes): EventsState {
  switch (action.type) {
    case UPDATE_EVENTS_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_EVENTS_UPCOMING_DATA:
      return {
        ...state,
        dataUpcoming: action.data,
      };
    case UPDATE_EVENTS_PASSED_DATA:
      return {
        ...state,
        dataPassed: action.data,
      };
    case UPDATE_EVENTS_ITEM:
      return {
        ...state,
        item: action.data,
      };
    case UPDATE_EVENTS_SEARCH:
      return {
        ...state,
        search: action.data,
      };
    case CLEAR_EVENTS:
      return {
        dataUpcoming: action.data.data ? [] : state.dataUpcoming,
        dataPassed: action.data.data ? [] : state.dataPassed,
        search: action.data.search ? [] : state.search,
        verification: action.data.verification ? [] : state.verification,
        item: null,
        state: state.state,
      };
    default:
      return state;
  }
}

export default eventReducer;
