import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Text } from 'react-native-paper';

import DisplayStackNavigator from './display/index';
import ProfileStackNavigator from './profile/index';
import SearchStackNavigator from './search/index';
import SettingsStackNavigator from './settings/index';
import UserContentStackNavigator from './userContent/index';
import DrawerList from './Drawer';

import ArticleList from './home/articles/views/List';
import PetitionList from './home/petitions/views/List';
import EventList from './home/events/views/List';
import ExplorerList from './home/explorer/views/List';

import { colors } from '../styles/Styles';
import { navigatorStyles } from '../styles/NavStyles';

const Tab = createBottomTabNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Actus"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Actus') {
            iconName = 'newspaper';
          } else if (route.name === 'Petitions') {
            iconName = 'comment-check-outline';
          } else if (route.name === 'Explorer') {
            iconName = 'compass';
          } else if (route.name === 'Event') {
            iconName = 'calendar';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        // This is for ios
        shifting: false,
        style: navigatorStyles.barStyle,
        activeTintColor: colors.primary,
        inactiveTintColor: colors.disabled,
      }}
      tabBar={() => <Text>TODO: Make Tabbar</Text>}
    >
      <Tab.Screen name="Display" component={DisplayStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
      <Tab.Screen name="UserContent" component={UserContentStackNavigator} />
      <Tab.Screen name="Drawer" component={DrawerList} />
      <Tab.Screen name="ArticleList" component={ArticleList} />
      <Tab.Screen name="PetitionList" component={PetitionList} />
      <Tab.Screen name="EventList" component={EventList} />
      <Tab.Screen name="ExplorerList" component={ExplorerList} />
    </Tab.Navigator>
  );
}

export default MainNavigator;
