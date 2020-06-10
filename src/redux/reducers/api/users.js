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
 * Reducer pour les users
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les users avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_USERS_STATE':
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case 'UPDATE_USERS':
      return {
        ...state,
        data: action.data,
      };
    case 'UPDATE_USERS_SEARCH':
      return {
        ...state,
        data: action.data,
      };
    case 'CLEAR_USERS':
      return {
        data: action.data.data ? [] : state.data,
        search: action.data.search ? [] : state.search,
        state: state.state,
      };
    default:
      return state;
  }
}

export default userReducer;
