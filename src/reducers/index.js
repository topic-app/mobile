import { combineReducers } from 'redux';

import articleReducer from './articles';
import prefReducer from './prefs';

const Reducer = combineReducers({
  articles: articleReducer,
  preferences: prefReducer,
});

export default Reducer;
