import AsyncStorage from '@react-native-async-storage/async-storage';
import localForage from 'localforage';
import { Platform } from 'react-native';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import articleReducer from './api/articles';
import commentReducer from './api/comments';
import departmentReducer from './api/departments';
import eventReducer from './api/events';
import groupReducer from './api/groups';
import legalReducer from './api/legal';
import linkingReducer from './api/linking';
import petitionReducer from './api/petitions';
import placeReducer from './api/places';
import schoolReducer from './api/schools';
import tagReducer from './api/tags';
import uploadReducer from './api/upload';
import userReducer from './api/users';
import articleDataReducer from './contentData/articles';
import eventDataReducer from './contentData/events';
import groupDataReducer from './contentData/groups';
import accountReducer from './data/account';
import locationReducer from './data/location';
import prefReducer from './data/prefs';

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
  // linking
  linking: linkingReducer,
  // upload
  upload: uploadReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
