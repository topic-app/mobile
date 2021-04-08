import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import Color from 'color';
import AppLoading from 'expo-app-loading';
import React from 'react';
import { Platform, Appearance, ColorSchemeName, View, Text } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { Config } from '@constants';
import { fetchGroups, fetchWaitingGroups, fetchAccount } from '@redux/actions/data/account';
import { fetchLocationData } from '@redux/actions/data/location';
import updatePrefs from '@redux/actions/data/prefs';
import Store from '@redux/store';
import themes from '@styles/helpers/theme';
import { Preferences, PreferencesState, State } from '@ts/types';
import { logger } from '@utils';
import { trackPageview } from '@utils/plausible';

import AppNavigator from './index';
import screens from './screens';

type Props = {
  useSystemTheme: boolean;
  theme: Preferences['theme'];
  useDevServer: boolean;
  reduxVersion: number;
  appOpens: number;
  preferences: PreferencesState;
};

const StoreApp: React.FC<Props> = ({
  useSystemTheme,
  theme: themeName,
  useDevServer,
  reduxVersion,
  appOpens,
  preferences,
}) => {
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
    // Redux db migration
    let currentVersion = reduxVersion;
    if (currentVersion < Config.reduxVersion || !currentVersion) {
      logger.warn(`StoreApp: Migrating Redux DB from ${currentVersion} to ${Config.reduxVersion}`);
      if (!currentVersion) {
        logger.warn('StoreApp: No current redux version, assuming version 0');
        currentVersion = 0;
      }
      if (currentVersion < 2) {
        updatePrefs({ analytics: true });
      }
      if (currentVersion < 3) {
        updatePrefs({
          completedFeedback: preferences.completedFeedback || [],
          appOpens: preferences.appOpens || 0,
        });
      }
      // Add all migration scripts here in descending order
      updatePrefs({ reduxVersion: Config.reduxVersion });
    }

    // Increase app opens
    updatePrefs({ appOpens: appOpens + 1 });

    // Theme
    Appearance.addChangeListener(handleAppearanceChange);
    return () => {
      Appearance.removeChangeListener(handleAppearanceChange);
    };
  }, [useSystemTheme]);

  React.useEffect(() => {
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

  const routeNameRef = React.useRef<string | undefined>();
  const navigationRef = React.useRef<NavigationContainerRef>(null);

  const insets = useSafeAreaInsets();

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
  const { preferences } = state;
  const { useSystemTheme, theme, useDevServer, reduxVersion, appOpens } = preferences;
  return { useSystemTheme, theme, useDevServer, reduxVersion, appOpens, preferences };
};

export default connect(mapStateToProps)(StoreApp);
