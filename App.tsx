import AppLoading from 'expo-app-loading';
import 'moment/locale/fr';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Store, { Persistor } from '@redux/store';

import StoreApp from './src/StoreApp';

function App() {
  return (
    <ReduxProvider store={Store}>
      <PersistGate persistor={Persistor} loading={<AppLoading />}>
        <SafeAreaProvider>
          <StoreApp />
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
