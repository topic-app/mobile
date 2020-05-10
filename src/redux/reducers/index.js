import { combineReducers } from 'redux';

import articleReducer from './api/articles';
import commentReducer from './api/comments';
import departmentReducer from './api/departments';
import eventReducer from './api/events';
import groupReducer from './api/groups';
import petitionReducer from './api/petitions';
import placeReducer from './api/places';
import schoolReducer from './api/schools';
import tagReducer from './api/tags';
import userReducer from './api/users';

import prefReducer from './data/prefs';
import accountReducer from './data/account';
import locationReducer from './data/location';

const Reducer = combineReducers({
  // api
  articles: articleReducer,
  comments: commentReducer,
  departments: departmentReducer,
  events: eventReducer,
  groups: groupReducer,
  petitions: petitionReducer,
  places: placeReducer,
  schools: schoolReducer,
  tags: tagReducer,
  users: userReducer,
  // data
  preferences: prefReducer,
  account: accountReducer,
  location: locationReducer,
});

export default Reducer;
