import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootStackNavigator from './src/index';
import Theme from './src/styles/Theme';
import Store from './src/redux/store';

// Render the app container component with the provider around it
export default class App extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <PaperProvider theme={Theme}>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootStackNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </ReduxProvider>
    );
  }
}
