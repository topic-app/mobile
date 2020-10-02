import React from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider, Divider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import { AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import { Preferences, State } from '@ts/types';
import themes from '@styles/Theme';
import { fetchLocationData } from '@redux/actions/data/location';
import { fetchGroups, fetchWaitingGroups, fetchAccount } from '@redux/actions/data/account';

import screens from './screens';
import AppNavigator from './index';

type Props = {
  preferences: Preferences;
};

const StoreApp: React.FC<Props> = ({ preferences }) => {
  let theme = themes[preferences.theme] || 'light';

  const colorScheme = useColorScheme();

  if (preferences.useSystemTheme) {
    theme = themes[colorScheme === 'dark' ? 'dark' : 'light'];
  }

  changeNavigationBarColor(theme.colors.tabBackground, !theme.dark, true);

  React.useEffect(
    React.useCallback(() => {
      fetchLocationData().catch((e) => console.log(`fetchLocationData err ${e}`));
      fetchGroups().catch((e) => console.log(`fetchGroups err ${e}`));
      fetchWaitingGroups().catch((e) => console.log(`fetchWaitingGroups err ${e}`));
      fetchAccount().catch((e) => console.log(`fetchAccount err ${e}`));
    }, [null]),
  );

  const linking = {
    prefixes: ['https://topicapp.fr', 'https://go.topicapp.fr', 'topic://'],
    config: {
      screens,
    },
  };

  const { colors } = theme;

  const navTheme = {
    dark: theme.dark,
    colors: {
      primary: colors.appBarText,
      background: colors.background,
      card: colors.appBar,
      text: colors.appBarText,
      border: colors.primary,
      notification: colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <>
          <NavigationContainer linking={linking} fallback={<AppLoading />} theme={navTheme}>
            <AppNavigator />
          </NavigationContainer>
        </>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(StoreApp);
