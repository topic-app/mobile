import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

import { ListHeaderConfig, DisplayHeaderConfig } from '../../components/Headers';
import EventListScreen from './pages/List';
import EventDisplayScreen from './pages/Display';

const Stack = createStackNavigator();

function EventNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="EventList">
      <Stack.Screen
        name="EventList"
        component={EventListScreen}
        options={{
          ...ListHeaderConfig,
          title: 'Évènements',
          drawer: true,
          actions: [
            {
              icon: 'magnify',
              onPress: () => navigation.navigate('Search', { initialCategory: 'Event' }),
            },
          ],
          overflow: [{ title: 'More', onPress: () => console.log('more') }],
        }}
      />
      <Stack.Screen
        name="EventDisplay"
        component={EventDisplayScreen}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                ...DisplayHeaderConfig,
                title: route.params.title,
              })
            : ({ route }) => ({
                ...DisplayHeaderConfig,
                title: 'Évènements',
                subtitle: route.params.title,
              })
        }
      />
    </Stack.Navigator>
  );
}

export default EventNavigator;

EventNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
