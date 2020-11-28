import {
  UPDATE_GROUPS_CREATION_DATA,
  FULL_CLEAR,
  GroupsContentState,
  GroupsContentActionTypes,
} from '@ts/redux';

const initialState: GroupsContentState = {
  creationData: {},
};

/**
 * @docs reducers
 * Reducer pour les groupes
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les groupes avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function groupDataReducer(
  state = initialState,
  action: GroupsContentActionTypes,
): GroupsContentState {
  switch (action.type) {
    case UPDATE_GROUPS_CREATION_DATA:
      return {
        ...state,
        creationData: action.data,
      };
    case FULL_CLEAR:
      return initialState;
    default:
      return state;
  }
}

export default groupDataReducer;
