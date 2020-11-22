import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import MainHistory from './views/History';

export type MainHistoryStackParams = {
  Params: undefined;
};

const Stack = createNativeStackNavigator<MainHistoryStackParams>();

function MainHistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Params" component={MainHistory} />
    </Stack.Navigator>
  );
}

export default MainHistoryStackNavigator;
