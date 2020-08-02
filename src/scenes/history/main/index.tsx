import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import MainHistory from './views/History';

const Stack = createStackNavigator();

function MainHistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params">
      <Stack.Screen
        name="Params"
        component={MainHistory}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Historique',
        })}
      />
    </Stack.Navigator>
  );
}

export default MainHistoryStackNavigator;
