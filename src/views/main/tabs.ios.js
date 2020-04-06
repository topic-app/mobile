import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import ActuNavigator from './article/index';
import PetitionNavigator from './petitions/index';
import ExplorerNavigator from './explorer/index';
import EventNavigator from './event/index';
import { navigatorStyles, colors } from '../../styles/navigatorStyles';

const Tab = createBottomTabNavigator();

function TabsNavigator() {
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
    >
      <Tab.Screen name="Actus" component={ActuNavigator} />
      <Tab.Screen name="Petitions" component={PetitionNavigator} />
      <Tab.Screen name="Explorer" component={ExplorerNavigator} />
      <Tab.Screen name="Event" component={EventNavigator} />
    </Tab.Navigator>
  );
}

export default TabsNavigator;
