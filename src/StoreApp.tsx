import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import themes from '@styles/Theme';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fetchLocationData } from '@redux/actions/data/location';
import { fetchGroups, fetchAccount } from '@redux/actions/data/account';
import AppNavigator from './index';

function StoreApp({ preferences }) {
  const theme = themes[preferences.theme] || 'light';

  React.useEffect(
    React.useCallback(() => {
      console.log('Updating');
      fetchLocationData();
      fetchGroups();
      fetchAccount();
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
