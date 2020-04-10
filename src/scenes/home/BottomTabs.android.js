import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import ActuNavigator from './article/index';
import PetitionNavigator from './petitions/index';
import ExplorerNavigator from './explorer/index';
import EventNavigator from './event/index';
import { navigatorStyles, colors } from '../../styles/navigatorStyles';

const Tab = createMaterialBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tab.Navigator
      shifting={false}
      initialRouteName="Actus"
      activeColor={colors.primary}
      inactiveColor={colors.disabled}
      barStyle={navigatorStyles.barStyle}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Actus') {
            // Note: We could render a different map icon when the map is selected
            iconName = 'newspaper';
          } else if (route.name === 'Petitions') {
            iconName = 'comment-check-outline';
          } else if (route.name === 'Explorer') {
            iconName = 'compass-outline';
          } else if (route.name === 'Event') {
            iconName = 'calendar';
          }

          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Actus" component={ActuNavigator} />
      <Tab.Screen name="Petitions" component={PetitionNavigator} />
      <Tab.Screen name="Event" component={EventNavigator} />
      <Tab.Screen name="Explorer" component={ExplorerNavigator} />
    </Tab.Navigator>
  );
}

export default TabsNavigator;
