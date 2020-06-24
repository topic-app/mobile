import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import themes from '@styles/Theme';
import { useColorScheme } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fetchLocationData } from '@redux/actions/data/location';
import { fetchGroups, fetchAccount } from '@redux/actions/data/account';
import { updatePrefs } from '@redux/actions/data/prefs';
import AppNavigator from './index';

function StoreApp({ preferences }) {
  let theme = themes[preferences.theme] || 'light';

  const colorScheme = useColorScheme();

  if (preferences.useSystemTheme) {
    theme = themes[colorScheme === 'dark' ? 'dark' : 'light'];
  }

  React.useEffect(
    React.useCallback(() => {
      fetchLocationData().catch((e) => console.log(`fetchLocationData err ${e}`));
      fetchGroups().catch((e) => console.log(`fetchGroups err ${e}`));
      fetchAccount().catch((e) => console.log(`fetchAccount err ${e}`));
    }, [null]),
  );

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
    useSystemTheme: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(StoreApp);
