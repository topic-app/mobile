import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import UserDisplay from './views/Display';

const Stack = createStackNavigator();

function UserDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={TransitionPresets.SlideFromRightIOS}>
      <Stack.Screen
        name="Display"
        component={UserDisplay}
        options={({ route }: { route: { params: { title?: string } } }) => ({
          ...HeaderConfig,
          title: route?.params?.title || 'Utilisateur',
          subtitle: route?.params?.title && 'Utilisateur - Aperçu',
        })}
      />
    </Stack.Navigator>
  );
}

export default UserDisplayStackNavigator;
