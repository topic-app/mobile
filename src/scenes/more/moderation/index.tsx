import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import ModerationList from './views/List';

export type ModerationStackParams = {
  List: undefined;
};

const Stack = createStackNavigator<ModerationStackParams>();

function ModerationStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={TransitionPresets.SlideFromRightIOS}>
      <Stack.Screen
        name="List"
        component={ModerationList}
        options={{ ...HeaderConfig, title: 'Modération' }}
      />
    </Stack.Navigator>
  );
}

export default ModerationStackNavigator;
