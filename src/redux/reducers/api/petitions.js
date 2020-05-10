import data from '../../../data/petitionListData.json';

const initialState = {
  data,
  state: {
    success: null,
    refreshing: false,
    error: null,
    loading: {
      initial: false,
      refresh: false,
      next: false,
      petition: false,
    },
  },
};

/**
 * @docs reducers
 * Reducer pour les petitions
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_PETITIONS', 'CLEAR_PETITIONS'] Le type d'action à effectuer: mettre à jour les petitions avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function petitionReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PETITIONS_STATE':
      return {
        ...state,
        state: action.data,
      };
    case 'UPDATE_PETITIONS':
      return {
        ...state,
        data: action.data,
      };
    case 'CLEAR_PETITIONS':
      return { data: [], state: state.state };
    default:
      return state;
  }
}

export default petitionReducer;
