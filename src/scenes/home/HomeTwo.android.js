import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import ArticleList from './articles/views/List';
import PetitionList from './petitions/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';

import { colors } from '../../styles/Styles';
import { navigatorStyles } from '../../styles/NavStyles';

const Tab = createMaterialBottomTabNavigator();

function HomeTwoNavigator() {
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

export default HomeTwoNavigator;
