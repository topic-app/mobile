import React from 'react';
import { createNativeStackNavigator, TransitionPresets } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';
import GroupDisplay from './views/Display';
import GroupDescription from './views/Description';

const Stack = createNativeStackNavigator();

function GroupDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={GroupDisplay}
        options={({ route }) => ({
          headerShown: false,
          title: route.params.title || 'Groupe',
          subtitle: route.params.title && 'Groupe - Aperçu',
        })}
      />
    </Stack.Navigator>
  );
}

export default GroupDisplayStackNavigator;
