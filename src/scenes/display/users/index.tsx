import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import UserDisplay from './views/Display';

export type UserDisplayStackParams = {
  Display: { id: string };
};

const Stack = createNativeStackNavigator<UserDisplayStackParams>();

function UserDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen name="Display" component={UserDisplay} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default UserDisplayStackNavigator;
