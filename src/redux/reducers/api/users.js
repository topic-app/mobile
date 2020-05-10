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
      user: false,
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
        state: action.data,
      };
    case 'UPDATE_USERS':
      return {
        ...state,
        data: action.data,
      };
    case 'CLEAR_USERS':
      return { data: [], state: state.state };
    default:
      return state;
  }
}

export default userReducer;
