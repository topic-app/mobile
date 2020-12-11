import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  NavigationProp,
  useLinkProps,
  Link,
  NavigatorScreenParams,
  CompositeNavigationProp,
} from '@react-navigation/native';
import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Text, Divider, Drawer as PaperDrawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { Permissions } from '@constants/index';
import { State, Account } from '@ts/types';
import { useTheme, useLayout, checkPermission } from '@utils/index';

import { AppScreenNavigationProp } from '..';
import { NativeStackNavigationProp } from '../utils/stack';
import MainStackNavigator, { MainStackParams } from './Main';
import AndroidNavigator from './Root.android';

type TabItemProps = {
  label: string;
  icon: string;
  onPress: () => void;
  active: boolean;
};

const TabItem: React.FC<TabItemProps> = ({ label, onPress, icon, active }) => {
  const { colors } = useTheme();
  const color = active ? colors.primary : colors.disabled;
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ alignItems: 'center' }}>
          <Icon name={icon} size={28} color={color} />
          <Text style={{ fontSize: 11, color }}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

type DrawerContentProps = {
  navigation: any;
  drawerExpanded: boolean;
  setDrawerExpanded: (state: boolean) => any;
  account: Account;
};

type NavRoute = [
  string,
  {
    screen: string;
    params?: object;
  },
];

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
      route: () =>
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
    {
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
    },
    {
      type: 'divider',
    },
    ...(account.loggedIn
      ? [
          {
            key: 'profile',
            type: 'button',
            icon: 'account-outline',
            text: 'Profil',
            path: '/profil',
            navigate: () =>
              navigation.navigate('Main', {
                screen: 'More',
                params: { screen: 'Profile', params: { screen: 'Profile' } },
              }),
          },
          {
            key: 'groups',
            type: 'button',
            icon: 'account-group-outline',
            text: 'Mes groups',
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
                  icon: 'shield-check-outline',
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
            type: 'divider',
          },
        ]
      : []),
    {
      key: 'settings',
      text: 'Paramètres',
      type: 'button',
      icon: 'settings-outline',
      path: '/parametres',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'Settings', params: { screen: 'List' } },
        }),
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
      text: 'A propos',
      type: 'button',
      icon: 'information-outline',
      path: '/apropos',
      navigate: () =>
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'About', params: { screen: 'List' } },
        }),
    },
  ];

  const [active, setActive] = React.useState(items[0].key);

  const isActive = (name: string) => active === name;

  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.surface }}>
      <View>
        <View style={{ height: 70 }} />
        <Divider style={{ marginVertical: 10 }} />
        {items.map((item) => {
          const onLinkPress = () => {
            if (item.navigate) item.navigate();
            setActive(item.key);
          };
          if (item.type === 'button') {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: drawerExpanded ? undefined : 'center',
                }}
              >
                <PaperDrawer.Item
                  style={{
                    ...(isActive(item.key || '')
                      ? { backgroundColor: colors.activeDrawerItem }
                      : {}),
                    width: drawerExpanded ? 230 : 40,
                  }}
                  key={item.key}
                  icon={item.icon}
                  label={drawerExpanded ? item.text || '' : ''}
                  onPress={onLinkPress}
                />
              </View>
            );
          } else if (item.type === 'divider') {
            return <Divider style={{ marginVertical: 10 }} />;
          } else {
            return null;
          }
        })}
      </View>
      <View style={{ alignItems: 'center' }}>
        {account.loggedIn ? (
          <PaperDrawer.Item
            icon="account"
            style={drawerExpanded ? { width: 230 } : { width: 40 }}
            label={`@${account.accountInfo?.user?.info?.username}`}
          />
        ) : (
          <View>
            <PaperDrawer.Item
              icon="account-outline"
              style={drawerExpanded ? { width: 230 } : { width: 40 }}
              label="Se connecter"
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Login',
                })
              }
            />
            <PaperDrawer.Item
              icon="account-plus-outline"
              style={drawerExpanded ? { width: 230 } : { width: 40 }}
              label="Créer un compte"
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
          style={drawerExpanded ? { width: 230 } : { width: 40 }}
          label=""
          onPress={() => setDrawerExpanded(!drawerExpanded)}
        />
      </View>
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
  if (useLayout() === 'desktop') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [drawerExpanded, setDrawerExpanded] = React.useState(false);

    return (
      <Drawer.Navigator
        initialRouteName="Main"
        drawerType="permanent"
        drawerStyle={{ width: drawerExpanded ? 250 : 70 }}
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
    );
  } else {
    return <AndroidNavigator />;
  }
}

export default RootNavigator;
