import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import GroupDisplay from './views/Display';
import GroupDescription from './views/Description';

const Stack = createStackNavigator();

function GroupDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={TransitionPresets.SlideFromRightIOS}>
      <Stack.Screen
        name="Display"
        component={GroupDisplay}
        options={({ route }) => ({
          ...HeaderConfig,
          title: route.params.title || 'Groupe',
          subtitle: route.params.title && 'Groupe - Aperçu',
        })}
      />
      <Stack.Screen
        name="Description"
        component={GroupDescription}
        options={({ route }) => ({
          ...HeaderConfig,
          title: route.params.title || 'Groupe - Description',
          subtitle: route.params.title && 'Groupe - Description',
        })}
      />
    </Stack.Navigator>
  );
}

export default GroupDisplayStackNavigator;
