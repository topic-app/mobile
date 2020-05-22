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
 * Reducer pour les articles
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les articles avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function articleReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ARTICLES_STATE':
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case 'UPDATE_ARTICLES':
      return {
        ...state,
        data: action.data,
      };
    case 'CLEAR_ARTICLES':
      return { data: [], state: state.state };
    default:
      return state;
  }
}

export default articleReducer;
