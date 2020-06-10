import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import getNavigatorStyles from '@styles/NavStyles';

import ArticleList from './articles/views/List';
import PetitionList from './petitions/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';

const Tab = createMaterialBottomTabNavigator();

function HomeTwoNavigator() {
  const theme = useTheme();
  const { colors } = theme;
  const navigatorStyles = getNavigatorStyles(theme);
  return (
    <Tab.Navigator
      shifting={false}
      initialRouteName="Article"
      activeColor={colors.primary}
      inactiveColor={colors.disabled}
      barStyle={navigatorStyles.barStyle}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Article') {
            // Note: We could render a different map icon when the map is selected
            iconName = 'newspaper';
          } else if (route.name === 'Event') {
            iconName = 'calendar';
          } else if (route.name === 'Petition') {
            iconName = 'comment-check-outline';
          } else if (route.name === 'Explorer') {
            iconName = 'compass-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Article" component={ArticleList} options={{ title: 'Actus' }} />
      <Tab.Screen name="Event" component={EventList} options={{ title: 'Evènements' }} />
      <Tab.Screen name="Petition" component={PetitionList} options={{ title: 'Pétitions' }} />
      <Tab.Screen name="Explorer" component={ExplorerList} options={{ title: 'Explorer' }} />
    </Tab.Navigator>
  );
}

HomeTwoNavigator.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      disabled: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default HomeTwoNavigator;
