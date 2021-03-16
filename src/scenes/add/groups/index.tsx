import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { ReduxLocation, GroupCreationData } from '@ts/types';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { AddScreenNavigationProp } from '../index';
import GroupAdd from './Add';
import GroupAddSuccess from './AddSuccess';

// TODO: Define GroupCreationData

export type GroupAddStackParams = {
  Add: undefined;
  Success: { id?: string; creationData?: GroupCreationData };
  Location: {
    hideSearch: boolean;
    type: 'schools' | 'departements' | 'regions' | 'other';
    initialData?: ReduxLocation;
    callback: (location: Partial<ReduxLocation>) => any;
  };
};

export type GroupAddScreenNavigationProp<
  K extends keyof GroupAddStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<GroupAddStackParams, K>,
  AddScreenNavigationProp<'Group'>
>;

const Stack = createNativeStackNavigator<GroupAddStackParams>();

function GroupAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Add" component={GroupAdd} options={{ title: 'Créer un groupe' }} />
      <Stack.Screen
        name="Success"
        component={GroupAddSuccess}
        options={{ title: 'Créer un groupe' }}
      />
    </Stack.Navigator>
  );
}

export default GroupAddStackNavigator;
