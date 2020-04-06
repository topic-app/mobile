import data from '../views/main/event/data/testDataList.json';

const initialState = data;

<<<<<<< HEAD
function eventReducer(state = initialState, event) {
  switch (event.type) {
    case 'UPDATE_ARTICLES':
      //
      //console.log(state);
      return state;
    case 'CLEAR_DATABASE':
      return ['bye'];
=======
/**
 * @docs reducers
 * Reducer pour les evenements
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_EVENTS', 'CLEAR_EVENTS'] Le type d'action à effectuer: mettre à jour les evenements avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function eventReducer(state = initialState, event) {
  switch (event.type) {
    case 'UPDATE_EVENTS':
      return event.data;
    case 'CLEAR_EVENTS':
      return { events: [], state: state.state };
>>>>>>> Add docs to reducers
    default:
      return state;
  }
}

export default eventReducer;
