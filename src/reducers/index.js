import { combineReducers } from 'redux';

import articleReducer from './articles';
import prefReducer from './prefs';
import evenementReducer from './evenement';

const Reducer = combineReducers({
  articles: articleReducer,
  evenements: evenementReducer,
  preferences: prefReducer,
});

export default Reducer;
