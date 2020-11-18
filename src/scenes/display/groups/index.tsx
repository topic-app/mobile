import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import GroupDescription from './views/Description';
import GroupDisplay from './views/Display';

export type GroupDisplayStackParams = {
  Display: { id: string; verification: boolean };
  Description: { id: string };
};

const Stack = createNativeStackNavigator<GroupDisplayStackParams>();

function GroupDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={GroupDisplay} />
      <Stack.Screen name="Description" component={GroupDescription} />
    </Stack.Navigator>
  );
}

export default GroupDisplayStackNavigator;
