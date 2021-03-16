import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { HomeOneScreenNavigationProp } from './HomeOne';
import ArticleList from './articles/List';
import EventList from './events/List';
import ExplorerList from './explorer/List';
import ListScreen from './list/List';

// import PetitionList from './petitions/views/List';

export type HomeTwoNavParams = {
  Article: { initialList?: string } | undefined;
  Event: { initialList?: string } | undefined;
  Petition: undefined;
  Explorer: undefined;
  Tests: undefined;
  List: undefined;
};

export type HomeTwoScreenNavigationProp<K extends keyof HomeTwoNavParams> = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTwoNavParams, K>,
  HomeOneScreenNavigationProp<'Home2'>
>;

const Tab = createBottomTabNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Tab.Navigator
      initialRouteName="Article"
      tabBarOptions={{
        activeTintColor: colors.bottomBarActive,
        inactiveTintColor: colors.bottomBarInactive,
        activeBackgroundColor: colors.bottomBar,
        inactiveBackgroundColor: colors.bottomBar,
      }}
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
            case 'List':
              iconName = 'dots-horizontal';
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
      <Tab.Screen name="Explorer" component={ExplorerList} options={{ title: 'Explorer' }} />
      <Tab.Screen name="List" component={ListScreen} options={{ title: 'Plus' }} />
    </Tab.Navigator>
  );
}

export default HomeTwoNavigator;
