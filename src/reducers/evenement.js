import data from '../views/main/evenement/data/testDataList.json';

const initialState = data;

function evenementReducer(state = initialState, evenement) {
  switch (evenement.type) {
    case 'UPDATE_ARTICLES':
      //
      console.log(state);
      return state;
    case 'CLEAR_DATABASE':
      return ['bye'];
    default:
      return state;
  }
}

export default evenementReducer;
