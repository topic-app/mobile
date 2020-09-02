import React from 'react';
import { createNativeStackNavigator, TransitionPresets } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';

import ModerationList from './views/List';

export type ModerationStackParams = {
  List: undefined;
};

const Stack = createNativeStackNavigator<ModerationStackParams>();

function ModerationStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={ModerationList}
        options={{ ...HeaderConfig, title: 'Modération' }}
      />
    </Stack.Navigator>
  );
}

export default ModerationStackNavigator;
