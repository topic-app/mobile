import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import GroupDisplay from './views/Display';

const Stack = createStackNavigator();

function GroupDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" headerMode="none">
      <Stack.Screen name="Display" component={GroupDisplay} />
    </Stack.Navigator>
  );
}

export default GroupDisplayStackNavigator;
