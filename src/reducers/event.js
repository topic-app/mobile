import data from '../views/main/event/data/testDataList.json';

const initialState = data;

function eventReducer(state = initialState, event) {
  switch (event.type) {
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

export default eventReducer;
