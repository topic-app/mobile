const initialState = {
  data: [],
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
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les places avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function placeReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PLACES_STATE':
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case 'UPDATE_PLACES':
      return {
        ...state,
        data: action.data,
      };
    case 'CLEAR_PLACES':
      return { data: [], state: state.state };
    default:
      return state;
  }
}

export default placeReducer;
