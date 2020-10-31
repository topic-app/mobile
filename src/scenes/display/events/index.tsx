import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import EventDisplay from './views/Display';

export type EventDisplayStackParams = {
  Display: { id: string; title: string; useLists: boolean; verification: boolean };
};

const Stack = createNativeStackNavigator<EventDisplayStackParams>();

function EventDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={EventDisplay} />
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
