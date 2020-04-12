import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleDisplay from './views/Display';

import { HeaderConfig } from '../../../components/Header';

const Stack = createStackNavigator();

function ArticleDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={ArticleDisplay}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                ...HeaderConfig,
                title: route.params.title,
              })
            : ({ route }) => ({
                ...HeaderConfig,
                title: 'Actus',
                subtitle: route.params.title,
                overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
              })
        }
      />
    </Stack.Navigator>
  );
}

export default ArticleDisplayStackNavigator;
