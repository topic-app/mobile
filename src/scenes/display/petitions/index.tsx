import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';
import PetitionDisplay from './views/Display';

const Stack = createNativeStackNavigator();

function PetitionDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={PetitionDisplay}
        options={({ route }) => ({
          ...HeaderConfig,
          title: route.params.title || 'Pétitions - Aperçu',
          subtitle: route.params.title && 'Pétitions - Aperçu',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        })}
      />
    </Stack.Navigator>
  );
}

export default PetitionDisplayStackNavigator;
