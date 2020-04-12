import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Text } from 'react-native-paper';

import DisplayStackNavigator from './display/index';
import MoreStackNavigator from './more/index';
import SearchStackNavigator from './search/index';

import HomeOneNavigator from './home/HomeOne';

import { colors } from '../styles/Styles';
import { navigatorStyles } from '../styles/NavStyles';

const Tab = createBottomTabNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home1"
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
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen name="Home1" component={HomeOneNavigator} />
      <Tab.Screen name="More" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
}

export default MainNavigator;
