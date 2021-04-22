import {
  RobotoMono_400Regular,
  RobotoMono_400Regular_Italic,
} from '@expo-google-fonts/roboto-mono';
import { RobotoSlab_400Regular } from '@expo-google-fonts/roboto-slab';
import {
  useFonts,
  Rubik_300Light,
  Rubik_300Light_Italic,
  Rubik_400Regular,
  Rubik_400Regular_Italic,
} from '@expo-google-fonts/rubik';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import Color from 'color';
import AppLoading from 'expo-app-loading';
import { decode } from 'jsonwebtoken';
import React from 'react';
import { Platform, Appearance, ColorSchemeName, View, Text } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { fetchGroups, fetchWaitingGroups, fetchAccount, logout } from '@redux/actions/data/account';
import { fetchLocationData } from '@redux/actions/data/location';
import updatePrefs from '@redux/actions/data/prefs';
import { updateToken } from '@redux/actions/data/profile';
import themes from '@styles/helpers/theme';
import { Preferences, State } from '@ts/types';
import { logger, messaging, Alert } from '@utils';
import { migrateReduxDB } from '@utils/compat/migrate';
import { trackPageview } from '@utils/plausible';

import AppNavigator from './index';
import screens from './screens';

const OpenDyslexic = require('@assets/fonts/OpenDyslexic/OpenDyslexic-Regular.otf');
const OpenDyslexic_Italic = require('@assets/fonts/OpenDyslexic/OpenDyslexic-Italic.otf');

type Props = {
  useSystemTheme: boolean;
  theme: Preferences['theme'];
  loggedIn: boolean;
  accountToken?: string;
  fontFamily: Preferences['fontFamily'];
  useDevServer: boolean;
  appOpens: number;
};

const StoreApp: React.FC<Props> = ({
  useSystemTheme,
  theme: themeName,
  loggedIn,
  accountToken,
  useDevServer,
  appOpens,
  fontFamily,
}) => {
  const [fontsLoaded] = useFonts({
    'Rubik-Light': Rubik_300Light,
    'Rubik-Light_Italic': Rubik_300Light_Italic,
    Rubik: Rubik_400Regular,
    Rubik_Italic: Rubik_400Regular_Italic,
    ...(fontFamily === 'Roboto-Slab'
      ? {
          'Roboto-Slab': RobotoSlab_400Regular,
        }
      : {}),
    ...(fontFamily === 'Roboto-Mono'
      ? {
          'Roboto-Mono': RobotoMono_400Regular,
          'Roboto-Mono_Italic': RobotoMono_400Regular_Italic,
        }
      : {}),
    ...(fontFamily === 'OpenDyslexic'
      ? {
          OpenDyslexic,
          OpenDyslexic_Italic,
        }
      : {}),
  });

  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(
    useSystemTheme ? Appearance.getColorScheme() : 'light',
  );

  const handleAppearanceChange = (prefs: Appearance.AppearancePreferences) => {
    setColorScheme(Platform.OS === 'ios' ? Appearance.getColorScheme() : prefs.colorScheme);
    if (Platform.OS === 'android' && Platform.Version >= 28) {
      // This only works on android 9 and above
      changeNavigationBarColor(theme.colors.tabBackground, !theme.dark, true);
    }
  };

  React.useEffect(() => {
    Appearance.addChangeListener(handleAppearanceChange);
    return () => {
      Appearance.removeChangeListener(handleAppearanceChange);
    };
  }, [useSystemTheme]);

  const routeNameRef = React.useRef<string | undefined>();
  const navigationRef = React.useRef<NavigationContainerRef>(null);

  React.useEffect(() => {
    migrateReduxDB();

    if (loggedIn && Platform.OS !== 'web') {
      messaging?.().getToken().then(updateToken);
      messaging?.().onTokenRefresh(updateToken);
    }

    // Increase app opens
    updatePrefs({ appOpens: appOpens + 1 });

    if (loggedIn && accountToken) {
      const decoded = decode(accountToken);
      if (
        typeof decoded !== 'object' ||
        typeof decoded?.exp !== 'number' ||
        decoded?.exp > new Date().valueOf()
      ) {
        logger.warn('Token expired, loggin out');
        logout();
        Alert.alert(
          'Vous avez été déconnectés',
          'Votre session a expiré',
          [
            { text: 'Fermer' },
            {
              text: 'Se connecter',
              onPress: () => navigationRef.current?.navigate('Auth', { screen: 'Login' }),
            },
          ],
          { cancelable: true },
        );
      }
    }

    fetchLocationData().catch((e) => logger.warn(`fetchLocationData err ${e}`));
    fetchGroups().catch((e) => logger.warn(`fetchGroups err ${e}`));
    fetchWaitingGroups().catch((e) => logger.warn(`fetchWaitingGroups err ${e}`));
    fetchAccount().catch((e) => logger.warn(`fetchAccount err ${e}`));
  }, [null]);

  const theme = useSystemTheme
    ? themes[colorScheme === 'dark' ? 'dark' : 'light']
    : themes[themeName];

  const linking = {
    prefixes: [
      'https://topicapp.fr',
      'https://go.topicapp.fr',
      'https://www.topicapp.fr',
      'topic://',
    ],
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

  const insets = useSafeAreaInsets();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

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
              const state = navigationRef?.current?.getRootState();

              const parseRootState = (navState: any, name?: string) => {
                let url = '';
                if (navState && navState.routes && navState.routes.length) {
                  const next =
                    navState.type === 'tab'
                      ? navState.routes[navState.index]
                      : navState.routes[navState.routes.length - 1];
                  url = parseRootState(next.state, next.name);
                }
                url = `${name || navState?.name || ''}/${url}`;
                return url;
              };

              const stateUrl = parseRootState(state);
              logger.debug(`Navigating to ${stateUrl}`);
              trackPageview({
                url: `${
                  Platform.OS === 'web' ? 'https://topicapp.fr' : 'https://app.topicapp.fr'
                }${stateUrl}`,
              });
            }

            routeNameRef.current = currentRouteName;
          }}
          documentTitle={{
            formatter: (options, _route) => {
              return options?.title ? `${options.title} · Topic` : 'Topic';
            },
          }}
        >
          {useDevServer ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  position: 'absolute',
                  right: 5,
                  zIndex: 10000,
                  marginTop: insets.top,
                  paddingHorizontal: 2,
                  borderRadius: 3,
                  backgroundColor: Color('#d11111').alpha(0.6).rgb().string(),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Icon name="wrench" color="white" size={12} />
                <Text style={{ color: 'white', fontSize: 12, paddingLeft: 5 }}>
                  Serveur de développement
                </Text>
              </View>
              <AppNavigator />
            </View>
          ) : (
            <AppNavigator />
          )}
        </NavigationContainer>
      </>
    </PaperProvider>
  );
};

const mapStateToProps = (state: State) => {
  const { useSystemTheme, theme, useDevServer, appOpens, fontFamily } = state.preferences;
  const { loggedIn, accountInfo } = state.account;
  const { accountToken } = accountInfo || {};
  return { useSystemTheme, theme, useDevServer, appOpens, fontFamily, loggedIn, accountToken };
};

export default connect(mapStateToProps)(StoreApp);
