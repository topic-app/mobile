import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

import EventListScreen from './pages/List';
import EventDisplayScreen from './pages/Display';
import { CustomHeaderBar } from '../../components/Tools';

const Stack = createStackNavigator();

function EventNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="EventList">
      <Stack.Screen
        name="EventList"
        component={EventListScreen}
        options={{
          title: 'Évènements',
          drawer: true,
          actions: [
            {
              icon: 'magnify',
              onPress: () => navigation.navigate('Search', { initialSelected: 'Petition' }),
            },
          ],
          overflow: [{ title: 'More', onPress: () => console.log('more') }],
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="EventDisplay"
        component={EventDisplayScreen}
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
