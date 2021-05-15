import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams, CompositeNavigationProp } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Divider, Drawer as PaperDrawer, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Avatar, Illustration, MainFeedback } from '@components';
import DownloadBanner from '@components/DownloadBanner';
import getStyles from '@styles/global';
import { State, Account } from '@ts/types';
import { useLayout, checkPermission, Permissions } from '@utils';
import { NativeStackNavigationProp } from '@utils/compat/stack';

import { AppScreenNavigationProp } from '..';
import MainStackNavigator, { MainStackParams } from './Main';
import AndroidNavigator from './Root.android';

type DrawerContentProps = {
  navigation: any;
  drawerExpanded: boolean;
  setDrawerExpanded: (state: boolean) => any;
  account: Account;
};

const DrawerContent: React.FC<DrawerContentProps> = ({
  navigation,
  drawerExpanded,
  setDrawerExpanded,
  account,
}) => {
  const items = [
    {
      key: 'articles',
      type: 'button',
      icon: 'newspaper',
      text: 'Actus',
      path: '/articles',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'Home1',
          params: { screen: 'Home2', params: { screen: 'Article' } },
        }),
    },
    {
      key: 'events',
      type: 'button',
      icon: 'calendar-outline',
      text: 'Évènements',
      path: '/evenements',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'Home1',
          params: { screen: 'Home2', params: { screen: 'Event' } },
        }),
    },
    /* {
      key: 'explore',
      type: 'button',
      icon: 'compass-outline',
      text: 'Explorer',
      path: '/explorer',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'Home1',
          params: { screen: 'Home2', params: { screen: 'Explore' } },
        }),
    }, */
    {
      key: 'divider1',
      type: 'divider',
    },
    ...(account.loggedIn
      ? [
          {
            key: 'profile',
            type: 'button',
            icon: 'account-outline',
            text: 'Mon profil',
            path: '/profil',
            navigate: () =>
              navigation.navigate('Main', {
                screen: 'Display',
                params: {
                  screen: 'User',
                  params: {
                    screen: 'Display',
                    params: {
                      id: account.accountInfo?.accountId,
                      title: account.accountInfo.user?.displayName,
                    },
                  },
                },
              }),
          },
          {
            key: 'groups',
            type: 'button',
            icon: 'account-group-outline',
            text: 'Mes groupes',
            path: '/groupes',
            navigate: () =>
              navigation.navigate('Main', {
                screen: 'More',
                params: { screen: 'MyGroups', params: { screen: 'List' } },
              }),
          },
          ...(checkPermission(account, {
            permission: Permissions.ARTICLE_VERIFICATION_VIEW,
            scope: {},
          }) ||
          checkPermission(account, {
            permission: Permissions.EVENT_VERIFICATION_VIEW,
            scope: {},
          }) ||
          checkPermission(account, {
            permission: Permissions.GROUP_VERIFICATION_VIEW,
            scope: {},
          }) ||
          checkPermission(account, {
            permission: Permissions.PLACE_VERIFICATION_VIEW,
            scope: {},
          })
            ? [
                {
                  key: 'moderation',
                  type: 'button',
                  icon: 'shield-outline',
                  text: 'Modération',
                  path: '/moderation',
                  navigate: () =>
                    navigation.navigate('Main', {
                      screen: 'More',
                      params: { screen: 'Moderation', params: { screen: 'List' } },
                    }),
                },
              ]
            : []),
          {
            key: 'divider2',
            type: 'divider',
          },
        ]
      : []),
    {
      key: 'settings',
      text: 'Paramètres',
      type: 'button',
      icon: 'cog-outline',
      path: '/parametres',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'Settings', params: { screen: 'List' } },
        }),
    },
    {
      key: 'feedback',
      text: 'Feedback',
      type: 'button',
      icon: 'comment-outline',
      path: '',
      navigate: () => setFeedbackVisible(true),
    },
    {
      key: 'legal',
      text: 'Mentions légales',
      type: 'button',
      icon: 'script-outline',
      path: '/legal',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'About', params: { screen: 'Legal' } },
        }),
    },
    {
      key: 'about',
      text: 'À propos',
      type: 'button',
      icon: 'information-outline',
      path: '/a_propos',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'About', params: { screen: 'List' } },
        }),
    },
  ];

  const [active, setActive] = React.useState(items[0].key);
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);

  const isActive = (name: string) => active === name;

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.appBar }}>
      <View>
        <View style={styles.centerIllustrationContainer}>
          <Illustration
            name={drawerExpanded ? 'topic-icon-text' : 'topic-icon'}
            style={{ height: 36, marginTop: 10 }}
            label="Logo Topic"
          />
        </View>
        <Divider style={{ marginVertical: 10 }} />
        {items.map((item) => {
          if (item.type === 'button') {
            return (
              <View
                key={item.key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: drawerExpanded ? undefined : 'center',
                }}
              >
                <PaperDrawer.Item
                  style={{
                    backgroundColor: isActive(item.key) ? colors.activeDrawerItem : undefined,
                    width: drawerExpanded ? 230 : 40,
                  }}
                  theme={{ ...theme, colors: { ...theme.colors, text: colors.appBarText } }}
                  icon={item.icon}
                  label={drawerExpanded ? item.text || '' : ''}
                  accessibilityLabel={item.text}
                  onPress={() => {
                    item.navigate?.();
                    setActive(item.key);
                  }}
                />
              </View>
            );
          } else if (item.type === 'divider') {
            return <Divider key={item.key} style={{ marginVertical: 10 }} />;
          } else {
            return null;
          }
        })}
      </View>
      <View style={{ alignItems: 'center' }}>
        {account.loggedIn ? (
          <View>
            <PaperDrawer.Item
              icon={() => (
                <View style={{ marginLeft: -6 }}>
                  <Avatar avatar={account.accountInfo?.user?.info?.avatar} size={35} />
                </View>
              )}
              style={drawerExpanded ? { width: 230 } : { width: 40 }}
              label={`@${account.accountInfo?.user?.info?.username}`}
            />
          </View>
        ) : (
          <View>
            <PaperDrawer.Item
              icon="account-outline"
              style={drawerExpanded ? { width: 230 } : { width: 40 }}
              theme={{ ...theme, colors: { ...theme.colors, text: colors.appBarText } }}
              label="Se connecter"
              accessibilityLabel="Se connecter"
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Login',
                })
              }
            />
            <PaperDrawer.Item
              icon="account-plus-outline"
              style={drawerExpanded ? { width: 230 } : { width: 40 }}
              theme={{ ...theme, colors: { ...theme.colors, text: colors.appBarText } }}
              label="Créer un compte"
              accessibilityLabel="Créer un compte"
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Create',
                })
              }
            />
          </View>
        )}

        <PaperDrawer.Item
          icon={drawerExpanded ? 'chevron-left' : 'chevron-right'}
          theme={{ ...theme, colors: { ...theme.colors, text: colors.appBarText } }}
          style={drawerExpanded ? { width: 230 } : { width: 40 }}
          label=""
          accessibilityLabel={
            drawerExpanded ? 'Réduire le menu principal' : 'Agrandir le menu principal'
          }
          onPress={() => setDrawerExpanded(!drawerExpanded)}
        />
      </View>
      <MainFeedback visible={feedbackVisible} setVisible={setFeedbackVisible} />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

const ReduxDrawerContent = connect(mapStateToProps)(DrawerContent);

export type RootNavParams = {
  Main: NavigatorScreenParams<MainStackParams>;
};

export type RootScreenNavigationProp<K extends keyof RootNavParams> = CompositeNavigationProp<
  NativeStackNavigationProp<RootNavParams, K>,
  AppScreenNavigationProp<'Root'>
>;

const Drawer = createDrawerNavigator<RootNavParams>();

function RootNavigator() {
  const [drawerExpanded, setDrawerExpanded] = React.useState(false);
  const theme = useTheme();
  const { colors } = theme;

  if (useLayout() === 'desktop') {
    return (
      <View style={{ flex: 1 }}>
        <Drawer.Navigator
          initialRouteName="Main"
          drawerType="permanent"
          drawerStyle={{
            width: drawerExpanded ? 250 : 70,
            borderRightColor: colors.disabled,
          }}
          drawerContent={({ navigation }) => (
            <ReduxDrawerContent
              navigation={navigation}
              drawerExpanded={drawerExpanded}
              setDrawerExpanded={setDrawerExpanded}
            />
          )}
        >
          <Drawer.Screen name="Main" component={MainStackNavigator} />
        </Drawer.Navigator>
        <DownloadBanner />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <AndroidNavigator />
        <DownloadBanner mobile />
      </View>
    );
  }
}

export default RootNavigator;
