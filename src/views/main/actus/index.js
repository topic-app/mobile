import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import ActuListScreen from './pages/List';
import ActuDisplayScreen from './pages/Display';

import { colors, customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function ActuNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="ActuListe" screenOptions={customStyles.header}>
      <Stack.Screen
        name="ActuListe"
        component={ActuListScreen}
        options={{
          title: 'Actus et évènements',
          headerLeft: () => (
            <IconButton
              onPress={() => navigation.openDrawer()}
              icon="menu"
              color={colors.text}
              size={28}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ActuArticle"
        component={ActuDisplayScreen}
        options={{
          title: 'Actus et évènements',
        }}
      />
    </Stack.Navigator>
  );
}

export default ActuNavigator;

ActuNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
