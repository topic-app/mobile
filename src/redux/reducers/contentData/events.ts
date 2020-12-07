import {
  EventsContentState,
  UPDATE_EVENTS_PARAMS,
  UPDATE_EVENTS_LISTS,
  UPDATE_EVENTS_READ,
  UPDATE_EVENTS_PREFS,
  UPDATE_EVENTS_QUICKS,
  UPDATE_EVENTS_CREATION_DATA,
  EventsContentActionTypes,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: EventsContentState = {
  params: {},
  read: [],
  creationData: {},
  lists: [
    {
      id: '0',
      name: 'Favoris',
      icon: 'star-outline',
      items: [],
    },
  ],
  quicks: [],
  prefs: {
    categories: ['upcoming', 'passed', 'following'],
    hidden: [],
  },
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
function eventDataReducer(
  state = initialState,
  action: EventsContentActionTypes,
): EventsContentState {
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
    case FULL_CLEAR:
      return initialState;
    default:
      return state;
  }
}

export default eventDataReducer;
