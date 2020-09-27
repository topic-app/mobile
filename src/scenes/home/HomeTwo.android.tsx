import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import getNavigatorStyles from '@styles/NavStyles';

import ArticleList from './articles/views/List';
import PetitionList from './petitions/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';
import UnauthorizedBeta from '@components/UnauthorizedBeta';

export type HomeTwoNavParams = {
  Article: { initialList: string } | undefined;
  Event: undefined;
  Petition: undefined;
  Explorer: undefined;
};

const Tab = createMaterialBottomTabNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  const theme = useTheme();
  const { colors } = theme;
  const navigatorStyles = getNavigatorStyles(theme);
  return (
    <Tab.Navigator
      shifting={false}
      initialRouteName="Article"
      activeColor={colors.bottomBarActive}
      inactiveColor={colors.bottomBarInactive}
      barStyle={[navigatorStyles.barStyle, { backgroundColor: colors.bottomBar }]}
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
      <Tab.Screen name="Event" component={EventList} options={{ title: 'Evènements' }} />
      {/* <Tab.Screen name="Petition" component={PetitionList} options={{ title: 'Pétitions' }} /> */}
      <Tab.Screen name="Explorer" component={ExplorerList} options={{ title: 'Explorer' }} />
    </Tab.Navigator>
  );
}

export default HomeTwoNavigator;
