import data from '../views/main/actus/data/testDataList.json';

const initialState = data;

function articleReducer(state = initialState, action) {
  switch (action.type) {
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

export default articleReducer;
