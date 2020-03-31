import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomHeaderBar } from '../../components/Tools';
import PetitionListScreen from './pages/List';
import PetitionDisplayScreen from './pages/Display';

const Stack = createStackNavigator();

function PetitionNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="PetitionListe">
      <Stack.Screen
        name="PetitionListe"
        component={PetitionListScreen}
        options={{
          title: 'Pétitions',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar drawer scene={scene} previous={previous} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="PetitionDisplay"
        component={PetitionDisplayScreen}
        options={{
          title: 'Petitions: Display',
        }}
      />
    </Stack.Navigator>
  );
}

export default PetitionNavigator;

PetitionNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
