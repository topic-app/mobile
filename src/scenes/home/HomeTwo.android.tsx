import { CompositeNavigationProp } from '@react-navigation/core';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationProp,
} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getStyles from '@styles/navigators';

import { HomeOneScreenNavigationProp } from './HomeOne';
import ArticleList from './articles/ArticleList';
import EventList from './events/List';
import ExplorerList from './explorer/List';

export type HomeTwoNavParams = {
  Article: { initialList?: string; article?: string } | undefined;
  Event: { initialList?: string; evenement?: string } | undefined;
  Explorer: undefined;
  Tests: undefined;
};

export type HomeTwoScreenNavigationProp<K extends keyof HomeTwoNavParams> = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<HomeTwoNavParams, K>,
  HomeOneScreenNavigationProp<'Home2'>
>;

const Tab = createMaterialBottomTabNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      shifting={false}
      initialRouteName="Article"
      activeColor={colors.bottomBarActive}
      inactiveColor={colors.bottomBarInactive}
      barStyle={[
        styles.barStyle,
        { backgroundColor: colors.bottomBar, paddingBottom: insets.bottom },
      ]}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          switch (route.name) {
            case 'Article':
              iconName = 'newspaper';
              break;
            case 'Event':
              iconName = 'calendar';
              break;
            case 'Explorer':
              iconName = 'compass-outline';
              break;
            default:
              iconName = 'shape';
          }

          return <Icon name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Article" component={ArticleList} options={{ title: 'Actus' }} />
      <Tab.Screen name="Event" component={EventList} options={{ title: '??v??nements' }} />
      {Platform.OS !== 'web' && (
        <Tab.Screen name="Explorer" component={ExplorerList} options={{ title: 'Explorer' }} />
      )}
    </Tab.Navigator>
  );
}

export default HomeTwoNavigator;
