import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import Color from 'color';
import { AppLoading } from 'expo';
import React from 'react';
import { Platform, Appearance, ColorSchemeName, View, Text } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { fetchGroups, fetchWaitingGroups, fetchAccount } from '@redux/actions/data/account';
import { fetchLocationData } from '@redux/actions/data/location';
import themes from '@styles/Theme';
import { Preferences, State } from '@ts/types';
import { analytics } from '@utils/firebase';
import { logger, useSafeAreaInsets } from '@utils/index';

import AppNavigator from './index';
import screens from './screens';

type Props = {
  useSystemTheme: boolean;
  theme: Preferences['theme'];
  useDevServer: boolean;
};

const StoreApp: React.FC<Props> = ({ useSystemTheme, theme: themeName, useDevServer }) => {
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(
    (useSystemTheme && Appearance.getColorScheme()) || 'light',
  );

  const handleAppearanceChange = (prefs: Appearance.AppearancePreferences) => {
    setColorScheme(prefs.colorScheme);
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
          onStateChange={
            Platform.OS !== 'web'
              ? async () => {
                  const previousRouteName = routeNameRef.current;
                  const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

                  if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                      screen_name: currentRouteName,
                      screen_class: currentRouteName,
                    });
                  }

                  routeNameRef.current = currentRouteName;
                }
              : undefined
          }
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
  const { useSystemTheme, theme, useDevServer } = state.preferences;
  return { useSystemTheme, theme, useDevServer };
};

export default connect(mapStateToProps)(StoreApp);
