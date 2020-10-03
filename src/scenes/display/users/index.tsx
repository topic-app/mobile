import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import { HeaderConfig } from '@components/Header';
import UserDisplay from './views/Display';

const Stack = createNativeStackNavigator();

function UserDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen name="Display" component={UserDisplay} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default UserDisplayStackNavigator;
