import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import { HeaderConfig } from '@components/Header';

import MyGroupsList from './views/List';
import MyGroupsEdit from './views/Edit';

const Stack = createNativeStackNavigator();

function MyGroupsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={MyGroupsList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Edit"
        component={MyGroupsEdit}
        options={({ route }) => ({
          ...HeaderConfig,
          title: route.params.title || 'Mes groupes - Edit',
          subtitle: route.params.title && 'Mes groupes - Edit',
        })}
      />
    </Stack.Navigator>
  );
}

export default MyGroupsStackNavigator;
