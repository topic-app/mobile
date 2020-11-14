import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import EventHistory from './views/History';

export type EventHistoryStackParams = {
  Params: undefined;
};

const Stack = createNativeStackNavigator<EventHistoryStackParams>();

function EventHistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params">
      <Stack.Screen name="Params" component={EventHistory} />
    </Stack.Navigator>
  );
}

export default EventHistoryStackNavigator;
