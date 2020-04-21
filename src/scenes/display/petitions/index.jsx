import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import PetitionDisplay from './views/Display';

import { HeaderConfig } from '../../../components/Header';

const Stack = createStackNavigator();

function PetitionDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={PetitionDisplay}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                ...HeaderConfig,
                title: route.params.title,
              })
            : ({ route }) => ({
                ...HeaderConfig,
                title: 'Pétitions',
                subtitle: route.params.title,
                overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
              })
        }
      />
    </Stack.Navigator>
  );
}

export default PetitionDisplayStackNavigator;
