function articleReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_PREF':
      return { hello: 'hello' };
    case 'CLEAR_PREF':
      return { bye: 'bye' };
    default:
      return state;
  }
}

export default articleReducer;
