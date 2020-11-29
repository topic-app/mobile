import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MoreScreenNavigationProp } from '../index';
import MyGroupsEdit from './views/Edit';
import MyGroupsList from './views/List';

export type MyGroupsStackParams = {
  List: undefined;
  Edit: undefined;
};

export type MyGroupsScreenNavigationProp<
  K extends keyof MyGroupsStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<MyGroupsStackParams, K>,
  MoreScreenNavigationProp<'MyGroups'>
>;

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
