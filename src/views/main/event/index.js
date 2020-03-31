import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

import EventList from './pages/List';
import EventDisplay from './pages/Display';
import { CustomHeaderBar } from '../../components/Tools';

const Stack = createStackNavigator();

function EventNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="EventListe">
      <Stack.Screen
        name="Eventiste"
        component={EventList}
        options={{
          title: 'Évènements',
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
        name="EventDisplay"
        component={EventDisplay}
        options={({ route }) => ({
          title: 'Évènements',
          subtitle: route.params.title,
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default EventNavigator;

EventNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
