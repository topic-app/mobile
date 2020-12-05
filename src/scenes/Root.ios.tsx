import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigationProp,
  NavigatorScreenParams,
  useNavigationState,
} from '@react-navigation/native';
import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '@utils/index';

import { AppScreenNavigationProp } from '..';
import { NativeStackNavigationProp } from '../utils/stack';
import MainStackNavigator, { MainStackParams } from './Main';

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
  navigation: any;
};

enum RouteName {
  ARTICLE = 'Article',
  EVENT = 'Event',
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
  // console.log(`Navigation ${JSON.stringify(navigation.dangerouslyGetState()?.routes, null, 2)}`);

  let active = RouteName.MORE;
  let translucent = false;

  const traverseState = (state: any) => {
    if (state?.name === 'Article' || state?.screen === 'Article') {
      active = RouteName.ARTICLE;
    } else if (state?.name === 'Event' || state?.screen === 'Event') {
      active = RouteName.EVENT;
    } else if (state?.name === 'Explorer' || state?.screen === 'Explorer') {
      active = RouteName.EXPLORER;
    }

    if (
      state?.name === 'Display' ||
      state?.name === 'Home1' ||
      state?.name === 'Home2' ||
      state?.screen === 'Display' ||
      state?.screen === 'Home1'
    ) {
      translucent = true;
    }

    if (state?.routes && state?.routes?.length > 0) {
      traverseState(state?.routes[state?.routes?.length - 1]);
    }
    if (state?.state?.routes && state?.state?.routes?.length > 0) {
      traverseState(state?.state?.routes[state?.state?.routes?.length - 1]);
    }
    if (state?.params) {
      traverseState(state?.params);
    }
  };

  const navigationState = useNavigationState((state) => state);

  traverseState(navigationState);

  // HACK: I was hoping to be able to fetch screenOptions from here,
  // but havent found any way yet. Currently, any screen that has
  // Article in the name gives a focused article tab, same for events etc.
  // Display and Home pages both have a translucent tab bar, others not

  const isActive = (name: RouteName) => active === name;

  const setActiveAndNavigate = (name: RouteName, route: NavRoute) => {
    navigation.navigate(...route);
  };

  const theme = useTheme();
  const { colors } = theme;

  const { bottom } = useSafeAreaInsets(); // get bottom inset

  return (
    <View style={{ backgroundColor: colors.surface }}>
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
  Main: NavigatorScreenParams<MainStackParams>;
};

export type RootScreenNavigationProp<K extends keyof RootNavParams> = CompositeNavigationProp<
  NativeStackNavigationProp<RootNavParams, K>,
  AppScreenNavigationProp<'Root'>
>;

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
