import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import MyGroupsList from './views/List';
import MyGroupsEdit from './views/Edit';

const Stack = createStackNavigator();

function MyGroupsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={MyGroupsList}
        options={{
          ...HeaderConfig,
          title: 'Mes Groupes',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
      <Stack.Screen
        name="Edit"
        component={MyGroupsEdit}
        options={{
          ...HeaderConfig,
          title: 'Mes Groupes: Edit',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
    </Stack.Navigator>
  );
}

export default MyGroupsStackNavigator;
