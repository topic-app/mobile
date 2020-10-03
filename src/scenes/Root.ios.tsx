import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSafeAreaInsets } from '@utils/index';

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
};

enum RouteName {
  ARTICLE = 'Article',
  EVENT = 'Event',
  PETITION = 'Petition',
  EXPLORER = 'Explorer',
  MORE = 'More',
}

type NavRoute = [
  string,
  {
    screen: string;
    params?: object;
  },
];

const BottomTabs: React.FC<BottomTabProps> = ({ navigation }) => {
  const [active, setActive] = React.useState(RouteName.ARTICLE);

  const isActive = (name: RouteName) => active === name;

  const setActiveAndNavigate = (name: RouteName, route: NavRoute) => {
    if (!isActive(name)) {
      setActive(name);
      navigation.navigate(...route);
    }
  };

  const { colors } = useTheme();

  const { bottom } = useSafeAreaInsets(); // get bottom inset

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.tabBackground,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: 2,
          marginBottom: bottom,
          height: 50,
          width: '100%',
        }}
      >
        <TabItem
          icon="newspaper"
          label="Actus"
          active={isActive(RouteName.ARTICLE)}
          onPress={() =>
            setActiveAndNavigate(RouteName.ARTICLE, [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Article', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="calendar"
          label="Évènements"
          active={isActive(RouteName.EVENT)}
          onPress={() =>
            setActiveAndNavigate(RouteName.EVENT, [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Event', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="comment-check-outline"
          label="Pétitions"
          active={isActive(RouteName.PETITION)}
          onPress={() =>
            setActiveAndNavigate(RouteName.PETITION, [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Petition', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="compass-outline"
          label="Explorer"
          active={isActive(RouteName.EXPLORER)}
          onPress={() =>
            setActiveAndNavigate(RouteName.EXPLORER, [
              'Main',
              {
                screen: 'Home1',
                params: {
                  screen: 'Home2',
                  params: { screen: 'Explorer', params: { noTransition: true } },
                },
              },
            ])
          }
        />
        <TabItem
          icon="dots-horizontal"
          label="Plus"
          active={isActive(RouteName.MORE)}
          onPress={() =>
            setActiveAndNavigate(RouteName.MORE, [
              'Main',
              {
                screen: 'More',
                params: {
                  screen: 'List',
                  params: { noTransition: true },
                },
              },
            ])
          }
        />
      </View>
    </View>
  );
};

export type RootNavParams = {
  Main: undefined;
};

const Tab = createBottomTabNavigator<RootNavParams>();

function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      tabBar={({ navigation }) => <BottomTabs navigation={navigation} />}
    >
      <Tab.Screen name="Main" component={MainStackNavigator} />
    </Tab.Navigator>
  );
}

export default RootNavigator;
