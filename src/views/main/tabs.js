import React from 'react';
import { Platform } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import ActuNavigator from './actus/index';
import PetitionNavigator from './petitions/index';
import CarteNavigator from './carte/index';

import { styles, colors } from '../../styles/Styles';

const createPlatformTabNavigator = Platform.OS === 'ios'
  ? createBottomTabNavigator
  : createMaterialBottomTabNavigator;

const TabsNavigator = createPlatformTabNavigator(
  {
    Actus: ActuNavigator,
    Petitions: PetitionNavigator,
    Carte: CarteNavigator,
  },
  {
    initialRouteName: 'Actus',
    color: colors.primary,
    activeColor: colors.primary,
    inactiveColor: colors.disabled,
    shifting: false,
    barStyle: styles.barStyle,
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        const IconComponent = MaterialCommunityIcons;
        let iconName;
        if (routeName === 'Actus') {
          iconName = 'newspaper';
        } else if (routeName === 'Petitions') {
          iconName = 'comment-check-outline';
        } else if (routeName === 'Carte') {
          iconName = 'map-outline';
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={24} color={tintColor} />;
      },
    }),
  },
);

export default TabsNavigator;
