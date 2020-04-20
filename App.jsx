import React from 'react';
import 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';

import Store from './src/redux/store';
import StoreApp from './StoreApp';

// Render the app container component with the provider around it
export default class App extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <StoreApp />
      </ReduxProvider>
    );
  }
}
