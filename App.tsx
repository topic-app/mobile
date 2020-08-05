import React from 'react';
import 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import 'moment/locale/fr';
import errorHandler from './ErrorHandler';

// import { enableScreens } from 'react-native-screens';
import Store from '@redux/store';
import StoreApp from './src/StoreApp';

// enableScreens();

setJSExceptionHandler(errorHandler);

function App() {
  return (
    <ReduxProvider store={Store}>
      <StoreApp />
    </ReduxProvider>
  );
}

export default App;
