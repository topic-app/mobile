const initialState = {
  data: [],
  state: {
    success: null,
    refreshing: false,
    error: null,
    loading: {
      initial: false,
      refresh: false,
      next: false,
      school: false,
    },
  },
};

/**
 * @docs reducers
 * Reducer pour les schools
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les schools avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function schoolReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SCHOOLS_STATE':
      return {
        ...state,
        state: action.data,
      };
    case 'UPDATE_SCHOOLS':
      return {
        ...state,
        data: action.data,
      };
    case 'CLEAR_SCHOOLS':
      return { data: [], state: state.state };
    default:
      return state;
  }
}

export default schoolReducer;
