import {
  EventsDataState,
  EventsActionTypes,
  UPDATE_EVENTS_PARAMS,
  UPDATE_EVENTS_LISTS,
  UPDATE_EVENTS_READ,
  UPDATE_EVENTS_PREFS,
  UPDATE_EVENTS_QUICKS,
  UPDATE_EVENTS_CREATION_DATA,
} from '@ts/redux';

import { Config } from '@constants/index';

const initialState: EventsDataState = {
  params: {},
  lists: Config.defaults.events.lists,
  prefs: Config.defaults.events.prefs,
  quicks: Config.defaults.events.quicks,
  read: [],
  creationData: {},
};

/**
 * @docs reducers
 * Reducer pour les évènements
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les évènements avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function eventDataReducer(state = initialState, action: EventsActionTypes): EventsDataState {
  switch (action.type) {
    case UPDATE_EVENTS_PARAMS:
      return {
        ...state,
        params: action.data,
      };
    case UPDATE_EVENTS_LISTS:
      return {
        ...state,
        lists: action.data,
      };
    case UPDATE_EVENTS_READ:
      return {
        ...state,
        read: action.data,
      };
    case UPDATE_EVENTS_QUICKS:
      return {
        ...state,
        quicks: action.data,
      };
    case UPDATE_EVENTS_PREFS:
      return {
        ...state,
        prefs: action.data,
      };
    case UPDATE_EVENTS_CREATION_DATA:
      return {
        ...state,
        creationData: action.data,
      };
    default:
      return state;
  }
}

export default eventDataReducer;
