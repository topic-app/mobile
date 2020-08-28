import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import EventDisplay from './views/Display';

export type EventDisplayStackParams = {
  Display: { id: string; title: string };
};

const Stack = createStackNavigator<EventDisplayStackParams>();

function EventDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={EventDisplay}
        options={({ route }) => ({
          headerShown: false,
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
