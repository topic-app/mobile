import React from 'react';
import 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import 'moment/locale/fr';

import Store from './src/redux/store';
import StoreApp from './src/StoreApp';

function App() {
  return (
    <ReduxProvider store={Store}>
      <StoreApp />
    </ReduxProvider>
  );
}

export default App;
