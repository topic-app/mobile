import React from 'react';
import { Platform } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import ActuNavigator from './actus/index';
import PetitionNavigator from './petitions/index';
import ExplorerNavigator from './explorer/index';
import EvenementNavigator from './evenement/index';
import { navigatorStyles, colors } from '../../styles/navigatorStyles';

const createPlatformTabNavigator =
  Platform.OS === 'ios' ? createBottomTabNavigator : createMaterialBottomTabNavigator;

const Tab = createPlatformTabNavigator();

function TabsNavigator() {
  if (Platform.OS !== 'ios') {
    return (
      <Tab.Navigator
        initialRouteName="Actus"
        activeColor={colors.primary}
        inactiveColor={colors.disabled}
        barStyle={navigatorStyles.barStyle}
        shifting={false}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === 'Actus') {
              // Note: We could render a different map icon when the map is selected
              iconName = 'newspaper';
            } else if (route.name === 'Petitions') {
              iconName = 'comment-check-outline';
            } else if (route.name === 'Explorer') {
              iconName = 'map-outline';
            } else if (route.name === 'Evenement') {
              iconName = 'calendar';
            }

            return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Actus" component={ActuNavigator} />
        <Tab.Screen name="Petitions" component={PetitionNavigator} />
        <Tab.Screen name="Evenement" component={EvenementNavigator} />
        <Tab.Screen name="Explorer" component={ExplorerNavigator} />
      </Tab.Navigator>
    );
  }
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
            iconName = 'map-outline';
          } else if (route.name === 'Evenement') {
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
      <Tab.Screen name="Evenement" component={EvenementNavigator} />
    </Tab.Navigator>
  );
}

export default TabsNavigator;
