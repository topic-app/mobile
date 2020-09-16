import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { Platform } from 'react-native';
import localForage from 'localforage';
import AsyncStorage from '@react-native-community/async-storage';

import reducer from './reducers/index';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  storage: Platform.OS === 'web' ? localForage : AsyncStorage,
  whitelist: ['articleData', 'eventData', 'preferences'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const Store = createStore(persistedReducer, applyMiddleware(thunk));

const Persistor = persistStore(Store);

export default Store;
export { Store, Persistor };
