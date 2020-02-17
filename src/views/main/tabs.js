// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import ActuNavigator from './actus/index';
import PetitionNavigator from './petitions/index';
import CarteNavigator from './carte/index';

import { styles, colors } from '../../styles/Styles';

const TabsNavigator = createMaterialBottomTabNavigator(
  {
    Actus: ActuNavigator,
    Petitions: PetitionNavigator,
    Carte: CarteNavigator,
  },
  {
    initialRouteName: 'Actus',
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
