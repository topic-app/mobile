import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import EventDisplay from './views/Display';
import EventProgram from './views/Program';

const Stack = createStackNavigator();

function EventDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={EventDisplay}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Évènements',
          subtitle: route.params.title,
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        })}
      />
      <Stack.Screen
        name="Program"
        component={EventProgram}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                ...HeaderConfig,
                title: route.params.title,
              })
            : ({ route }) => ({
                ...HeaderConfig,
                title: 'Programme',
                subtitle: route.params.title,
                overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
              })
        }
      />
    </Stack.Navigator>
  );
}

export default EventDisplayStackNavigator;
