import { combineReducers } from 'redux';

import articleReducer from './articles';
import prefReducer from './prefs';
import eventReducer from './event';
import petitionReducer from './petitions';
import accountReducer from './account';
import locationReducer from './location';

const Reducer = combineReducers({
  articles: articleReducer,
  events: eventReducer,
  petitions: petitionReducer,
  preferences: prefReducer,
  account: accountReducer,
  location: locationReducer,
});

export default Reducer;
