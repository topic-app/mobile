import React from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { connect } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import RootStackNavigator from './src/index';
import themes from './src/styles/Theme';

function StoreApp({ preferences }) {
  let theme;
  if (preferences.theme === 'system') {
    theme = themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
  } else {
    theme = themes[preferences.theme];
  }
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const mapStateToProps = (state) => {
  const { preferences } = state;
  return { preferences };
};

StoreApp.propTypes = {
  preferences: PropTypes.shape({
    theme: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(StoreApp);
