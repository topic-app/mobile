import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Text, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import getNavigatorStyles from '@styles/NavStyles';

import DisplayStackNavigator from './display/index';
import MoreStackNavigator from './more/index';
import SearchStackNavigator from './search/index';
import HomeOneNavigator from './home/HomeOne';

const Tab = createBottomTabNavigator();

function MainNavigator({ theme }) {
  const navigatorStyles = getNavigatorStyles(theme);
  const { colors } = theme;
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

MainNavigator.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      disabled: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withTheme(MainNavigator);
