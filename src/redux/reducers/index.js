import { combineReducers } from 'redux';

import articleReducer from './articles';
import prefReducer from './prefs';
import eventReducer from './event';

const Reducer = combineReducers({
  articles: articleReducer,
  events: eventReducer,
  preferences: prefReducer,
});

export default Reducer;
