import { combineReducers } from 'redux';

import articleReducer from './articles';
import prefReducer from './prefs';
import eventReducer from './evenement';

const Reducer = combineReducers({
  articles: articleReducer,
  events: eventReducer,
  preferences: prefReducer,
});

export default Reducer;
