import data from '../../views/main/petitions/data/testDataList.json';

const initialState = data;

function petitionReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PETITIONS':
      console.log(state);
      return state;
    case 'CLEAR_DATABASE':
      return ['bye'];
    default:
      return state;
  }
}

export default petitionReducer;
