import AsyncStorage from '@react-native-async-storage/async-storage';
import localForage from 'localforage';
import { Platform } from 'react-native';
import { createStore, applyMiddleware, AnyAction, compose, Middleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk, { ThunkDispatch } from 'redux-thunk';

import { Config } from '@constants/index';
import { State } from '@ts/types';

import reducer from './reducers/index';

// import { logger } from 'redux-logger';

// Persist reducers to save data to device storage
const persistConfig = {
  key: 'root',
  storage: Platform.OS === 'web' ? localForage : AsyncStorage,
  whitelist: ['articleData', 'eventData', 'preferences'],
};
const persistedReducer = persistReducer(persistConfig, reducer);

// Create an array of middlewares with thunk as an initial element
const middlewares: Middleware[] = [thunk];

// Add redux-logger to middlewares if we are in dev mode
// if (__DEV__) {
//   middlewares.push(logger);
// }

type DispatchFunctionType = ThunkDispatch<State, void, AnyAction>;

const Store = compose(applyMiddleware<DispatchFunctionType, State>(...middlewares))(createStore)(
  persistedReducer,
);

const Persistor = persistStore(Store);

if (Config.dev.disablePersist) {
  Persistor.purge();
}

export default Store;
export { Store, Persistor };
