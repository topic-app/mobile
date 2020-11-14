import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import ModerationList from './views/List';

export type ModerationStackParams = {
  List: undefined;
};

const Stack = createNativeStackNavigator<ModerationStackParams>();

function ModerationStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="List" component={ModerationList} />
    </Stack.Navigator>
  );
}

export default ModerationStackNavigator;
