import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationProp, useLinkProps, Link } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, useTheme, IconButton, Divider, Drawer as PaperDrawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { State, Account } from '@ts/types';
import getLayout from '@utils/getLayout';

import AndroidNavigator from './Root.android';
import MainStackNavigator from './Main';

// Can't use BlurView with expo :(
// import { BlurView, VibrancyView } from '@react-native-community/blur';

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

type BottomTabProps = {
  navigation: NavigationProp<any, any>;
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

const DrawerContent: React.FC<BottomTabProps> = ({
  navigation,
  drawerExpanded,
  setDrawerExpanded,
  account,
}) => {
  let items = [
    {
      key: 'articles',
      type: 'button',
      icon: 'newspaper',
      text: 'Actus',
      path: '/articles',
    },
    {
      key: 'events',
      type: 'button',
      icon: 'calendar-outline',
      text: 'Évènements',
      path: '/evenements',
    },
    {
      key: 'explore',
      type: 'button',
      icon: 'compass-outline',
      text: 'Explorer',
      path: '/explorer',
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
          },
          {
            key: 'groups',
            type: 'button',
            icon: 'account-group-outline',
            text: 'Mes groups',
            path: '/groupes',
          },
          /*...(account.permissions?.some(
            (p) =>
              p?.permission === 'article.verification.view' ||
              p?.permission === 'event.verification.view' ||
              p?.permission === 'petition.verification.view' ||
              p?.permission === 'place.verification.view' ||
              p?.permission === 'group.verification.view',
          )
            ? [
                {
                  key: 'moderation',
                  type: 'button',
                  icon: 'shield-check-outline',
                  text: 'Modération',
                  path: '/moderation',
                },
              ]
            : []),*/
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
    },
    {
      key: 'legal',
      text: 'Mentions légales',
      type: 'button',
      icon: 'script-outline',
      path: '/legal',
    },
    {
      key: 'about',
      text: 'A propos',
      type: 'button',
      icon: 'information-outline',
      path: '/apropos',
    },
  ];

  const [active, setActive] = React.useState(items[0].key);

  const isActive = (name: string) => active === name;

  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.surface }}>
      <View>
        <View style={{ height: 70 }}></View>
        <Divider style={{ marginVertical: 10 }} />
        {items.map((item) => {
          const onLinkPress = (data: any) => {
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
                <Link to={item.path}>
                  <PaperDrawer.Item
                    style={{
                      ...(isActive(item.key) ? { backgroundColor: colors.activeDrawerItem } : {}),
                      width: drawerExpanded ? 230 : 40,
                    }}
                    key={item.key}
                    icon={item.icon}
                    label={drawerExpanded ? item.text : ''}
                    onPress={onLinkPress}
                  />
                </Link>
              </View>
            );
          } else if (item.type === 'divider') {
            return <Divider style={{ marginVertical: 10 }} />;
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
              {...useLinkProps({ to: '/auth/connexion' })}
            />
            <PaperDrawer.Item
              icon="account-plus-outline"
              style={drawerExpanded ? { width: 230 } : { width: 40 }}
              label="Créer un compte"
              {...useLinkProps({ to: '/auth/creation' })}
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
  Main: undefined;
};

const Drawer = createDrawerNavigator<RootNavParams>();

function RootNavigator() {
  if (getLayout() === 'desktop') {
    let [drawerExpanded, setDrawerExpanded] = React.useState(false);
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
