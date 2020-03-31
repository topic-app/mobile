import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

import EvenementList from './pages/List';
import EvenementDisplay from './pages/Display';
import { CustomHeaderBar } from '../../components/Tools';

const Stack = createStackNavigator();

function EvenementNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="EvenementListe">
      <Stack.Screen
        name="Evenementiste"
        component={EvenementList}
        options={{
          title: 'Evènements',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar drawer scene={scene} previous={previous} navigation={navigation} />
          ),
          cardStyleInterpolator: ({ current, closing }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen
        name="EvenementDisplay"
        component={EvenementDisplay}
        options={({ route }) => ({
          title: 'Evènements',
          subtitle: route.params.title,
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default EvenementNavigator;

EvenementNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
