import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';
import MainHistory from './views/History';

const Stack = createNativeStackNavigator();

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
