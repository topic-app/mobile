import React from 'react';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';

import RootStackNavigator from './src/index';
import Theme from './src/styles/Theme';
import Store from './src/redux/store';

enableScreens();

// Render the app container component with the provider around it
export default class App extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <PaperProvider theme={Theme}>
          <NavigationContainer>
            <RootStackNavigator />
          </NavigationContainer>
        </PaperProvider>
      </ReduxProvider>
    );
  }
}
