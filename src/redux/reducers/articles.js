import data from '../../views/main/actus/data/testDataList.json';

const initialState = {data: [], state: { success: null, refreshing: false, error: null }};

function articleReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ARTICLES':
      return action.data;
    case 'CLEAR_DATABASE':
      return [];

    default:
      return state;
  }
}

export default articleReducer;
