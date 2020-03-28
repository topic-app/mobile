import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomHeaderBar } from '../../components/Tools';
import ActuListScreen from './pages/List';
import ActuDisplayScreen from './pages/Display';

import { customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function ActuNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="ActuListe">
      <Stack.Screen
        name="ActuListe"
        component={ActuListScreen}
        options={{
          title: 'Actus et évènements',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar drawer scene={scene} previous={previous} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="ActuArticle"
        component={ActuDisplayScreen}
        options={{
          title: 'Actus et évènements',
          subtitle: 'Article',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
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
