import { Platform } from 'react-native';
import { createStore, applyMiddleware, AnyAction } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk, { ThunkDispatch } from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import localForage from 'localforage';

import { State } from '@ts/types';
import { Config } from '@constants/index';

import reducer from './reducers/index';

const persistConfig = {
  key: 'root',
  storage: Platform.OS === 'web' ? localForage : AsyncStorage,
  whitelist: ['articleData', 'eventData', 'preferences'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

type DispatchFunctionType = ThunkDispatch<State, void, AnyAction>;

const Store = createStore(persistedReducer, applyMiddleware<DispatchFunctionType, State>(thunk));

const Persistor = persistStore(Store);

if (Config.dev.disablePersist) {
  Persistor.purge();
}

export default Store;
export { Store, Persistor };
