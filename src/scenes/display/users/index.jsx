import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserDisplay from './views/Display';

const Stack = createStackNavigator();

function UserDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" headerMode="none">
      <Stack.Screen name="Display" component={UserDisplay} />
    </Stack.Navigator>
  );
}

export default UserDisplayStackNavigator;
