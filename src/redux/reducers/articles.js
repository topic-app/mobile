import data from '../../views/main/actus/data/testDataList.json';

const initialState = {data: [], state: { success: null, refreshing: false, error: null }};

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
    case 'UPDATE_ARTICLES':
      return action.data;
    case 'CLEAR_DATABASE':
      return { articles: [], state: state.state };
    default:
      return state;
  }
}

export default articleReducer;
