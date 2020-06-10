const initialState = {
  data: [],
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
  },
};

/**
 * @docs reducers
 * Reducer pour les events
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_EVENTS', 'CLEAR_EVENTS'] Le type d'action à effectuer: mettre à jour les events avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function eventReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_EVENTS_STATE':
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case 'UPDATE_EVENTS':
      return {
        ...state,
        data: action.data,
      };
    case 'UPDATE_EVENTS_SEARCH':
      return {
        ...state,
        search: action.data,
      };
    case 'CLEAR_EVENTS':
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        state: state.state,
      };
    default:
      return state;
  }
}

export default eventReducer;
