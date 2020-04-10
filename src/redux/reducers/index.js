import { combineReducers } from 'redux';

import articleReducer from './articles';
import prefReducer from './prefs';
import eventReducer from './event';
import petitionReducer from './petitions';

const Reducer = combineReducers({
  articles: articleReducer,
  events: eventReducer,
  petitions: petitionReducer,
  preferences: prefReducer,
});

export default Reducer;
