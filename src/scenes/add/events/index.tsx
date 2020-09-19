import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import EventAdd from './views/Add';
import EventAddSuccess from './views/AddSuccess';
import EventAddLocation from './views/AddLocation';

const Stack = createStackNavigator();

function EventAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add">
      <Stack.Screen
        name="Add"
        component={EventAdd}
        options={{
          title: 'Créer un évènement',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Success"
        component={EventAddSuccess}
        options={{
          title: 'Evènement ajouté',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Location"
        component={EventAddLocation}
        options={{
          ...HeaderConfig,
          title: 'Localisation',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default EventAddStackNavigator;
