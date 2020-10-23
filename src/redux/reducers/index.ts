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
import legalReducer from './api/legal';

import articleDataReducer from './contentData/articles';
import eventDataReducer from './contentData/events';
import groupDataReducer from './contentData/groups';

import prefReducer from './data/prefs';
import accountReducer from './data/account';
import locationReducer from './data/location';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import localForage from 'localforage';

const accountPersistConfig = {
  key: 'auth',
  storage: Platform.OS === 'web' ? localForage : AsyncStorage,
  whitelist: ['loggedIn', 'accountInfo', 'groups', 'permissions'],
};

const locationPersistConfig = {
  key: 'location',
  storage: Platform.OS === 'web' ? localForage : AsyncStorage,
  whitelist: ['selected', 'schools', 'departments', 'schoolData', 'departmentData', 'global'],
};

const rootReducer = combineReducers({
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
  legal: legalReducer,
  // contentData
  articleData: articleDataReducer,
  eventData: eventDataReducer,
  groupData: groupDataReducer,
  // data
  preferences: prefReducer,
  account: persistReducer(accountPersistConfig, accountReducer),
  location: persistReducer(locationPersistConfig, locationReducer),
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
