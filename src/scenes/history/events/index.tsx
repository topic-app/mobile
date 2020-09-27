import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import EventHistory from './views/History';

const Stack = createStackNavigator();

function EventHistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params">
      <Stack.Screen
        name="Params"
        component={EventHistory}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Historique',
          subtitle: 'Évènements',
        })}
      />
    </Stack.Navigator>
  );
}

export default EventHistoryStackNavigator;
