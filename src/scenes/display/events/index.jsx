import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import EventDisplay from './views/Display';

const Stack = createStackNavigator();

function EventDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={EventDisplay}
        options={({ route }) => ({
          ...HeaderConfig,
          title: route.params.title || 'Évènements - Aperçu',
          subtitle: route.params.title && 'Évènements - Aperçu',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        })}
      />
      {/*
      <Stack.Screen
        name="Program"
        component={EventProgram}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Programme',
          subtitle: route.params.title,
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        })}
      />
      */}
    </Stack.Navigator>
  );
}

export default EventDisplayStackNavigator;
