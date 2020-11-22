import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import MyGroupsList from './views/List';
import MyGroupsEdit from './views/Edit';

export type MyGroupsStackParams = {
  List: undefined;
  Edit: undefined;
};

const Stack = createNativeStackNavigator<MyGroupsStackParams>();

function MyGroupsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="List" component={MyGroupsList} />
      <Stack.Screen name="Edit" component={MyGroupsEdit} />
    </Stack.Navigator>
  );
}

export default MyGroupsStackNavigator;
