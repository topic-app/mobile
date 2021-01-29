import { CompositeNavigationProp } from '@react-navigation/core';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationProp,
} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getNavigatorStyles from '@styles/NavStyles';
import { useTheme, useSafeAreaInsets } from '@utils/index';

import { HomeOneScreenNavigationProp } from './HomeOne';
import ArticleList from './articles/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';

// import PetitionList from './petitions/views/List';

export type HomeTwoNavParams = {
  Article: { initialList?: string } | undefined;
  Event: { initialList?: string } | undefined;
  Petition: undefined;
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
  const navigatorStyles = getNavigatorStyles(theme);

  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      shifting={false}
      initialRouteName="Article"
      activeColor={colors.bottomBarActive}
      inactiveColor={colors.bottomBarInactive}
      barStyle={[
        navigatorStyles.barStyle,
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
            case 'Petition':
              iconName = 'comment-check-outline';
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
      <Tab.Screen name="Event" component={EventList} options={{ title: 'Évènements' }} />
      {/* <Tab.Screen name="Petition" component={PetitionList} options={{ title: 'Pétitions' }} /> */}
      {Platform.OS !== 'web' && (
        <Tab.Screen name="Explorer" component={ExplorerList} options={{ title: 'Explorer' }} />
      )}
    </Tab.Navigator>
  );
}

export default HomeTwoNavigator;
