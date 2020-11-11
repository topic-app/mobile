import { Platform } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import localForage from 'localforage';

import { Config } from '@constants/index';

import reducer from './reducers/index';

const persistConfig = {
  key: 'root',
  storage: Platform.OS === 'web' ? localForage : AsyncStorage,
  whitelist: ['articleData', 'eventData', 'preferences'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const Store = createStore(persistedReducer, applyMiddleware(thunk));

const Persistor = persistStore(Store);

if (Config.dev.disablePersist) {
  Persistor.purge();
}

export default Store;
export { Store, Persistor };
