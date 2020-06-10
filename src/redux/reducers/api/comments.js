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
  },
};

/**
 * @docs reducers
 * Reducer pour les comments
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les comments avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function commentReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_COMMENTS_STATE':
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case 'UPDATE_COMMENTS':
      return {
        ...state,
        data: action.data,
      };
    case 'UPDATE_COMMENTS_SEARCH':
      return {
        ...state,
        search: action.data,
      };
    case 'CLEAR_COMMENTS':
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        state: state.state,
      };
    default:
      return state;
  }
}

export default commentReducer;
