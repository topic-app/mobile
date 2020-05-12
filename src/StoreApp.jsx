import React from 'react';
import { useColorScheme } from 'react-native-appearance';
import { Provider as PaperProvider } from 'react-native-paper';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import themes from '@styles/Theme';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './index';

function StoreApp({ preferences }) {
  let theme;
  const systemTheme = useColorScheme();

  if (preferences.theme === 'system') {
    theme = themes[systemTheme === 'dark' ? 'dark' : 'light'];
  } else {
    theme = themes[preferences.theme];
  }
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
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
