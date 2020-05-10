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
      tag: false,
    },
  },
};

/**
 * @docs reducers
 * Reducer pour les tags
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les tags avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function tagReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_TAGS_STATE':
      return {
        ...state,
        state: action.data,
      };
    case 'UPDATE_TAGS':
      return {
        ...state,
        data: action.data,
      };
    case 'CLEAR_TAGS':
      return { data: [], state: state.state };
    default:
      return state;
  }
}

export default tagReducer;
