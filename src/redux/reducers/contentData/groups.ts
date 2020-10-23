import { GroupsDataState, GroupsActionTypes, UPDATE_GROUPS_CREATION_DATA } from '@ts/redux';

const initialState: GroupsDataState = {
  creationData: {},
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
function groupDataReducer(state = initialState, action: GroupsActionTypes): GroupsDataState {
  switch (action.type) {
    case UPDATE_GROUPS_CREATION_DATA:
      return {
        ...state,
        creationData: action.data,
      };
    default:
      return state;
  }
}

export default groupDataReducer;
