import analytics from '@react-native-firebase/analytics';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { AppLoading } from 'expo';
import React from 'react';
import { useColorScheme, Platform } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Provider as PaperProvider } from 'react-native-paper';
import { connect } from 'react-redux';

import { fetchGroups, fetchWaitingGroups, fetchAccount } from '@redux/actions/data/account';
import { fetchLocationData } from '@redux/actions/data/location';
import themes from '@styles/Theme';
import { Preferences, State } from '@ts/types';
import { logger } from '@utils/index';

import AppNavigator from './index';
import screens from './screens';

type Props = {
  preferences: Preferences;
};

const StoreApp: React.FC<Props> = ({ preferences }) => {
  let theme = themes[preferences.theme] || 'light';

  const colorScheme = useColorScheme();

  if (preferences.useSystemTheme) {
    theme = themes[colorScheme === 'dark' ? 'dark' : 'light'];
  }

  if (Platform.OS === 'android' && Platform.Version >= 28) {
    // This only works on android 9 and above
    changeNavigationBarColor(theme.colors.tabBackground, !theme.dark, true);
  }
  React.useEffect(
    React.useCallback(() => {
      fetchLocationData().catch((e) => logger.warn(`fetchLocationData err ${e}`));
      fetchGroups().catch((e) => logger.warn(`fetchGroups err ${e}`));
      fetchWaitingGroups().catch((e) => logger.warn(`fetchWaitingGroups err ${e}`));
      fetchAccount().catch((e) => logger.warn(`fetchAccount err ${e}`));
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

  const routeNameRef = React.useRef<string | undefined>();
  const navigationRef = React.useRef<NavigationContainerRef | null>();

  return (
    <PaperProvider theme={theme}>
      <>
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          fallback={<AppLoading />}
          theme={navTheme}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

            if (previousRouteName !== currentRouteName) {
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }

            routeNameRef.current = currentRouteName;
          }}
        >
          <AppNavigator />
        </NavigationContainer>
      </>
    </PaperProvider>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(StoreApp);
