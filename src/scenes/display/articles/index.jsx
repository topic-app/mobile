import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import ArticleDisplay from './views/Display';

const Stack = createStackNavigator();

function ArticleDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={ArticleDisplay}
        options={
          Platform.OS === 'ios'
            ? ({ navigation, route }) => ({
                ...HeaderConfig,
                title: route.params.title,
                headerLeft: () => (
                  <HeaderConfig.BackButton
                    previous={route.params.previous}
                    navigation={navigation}
                  />
                ),
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
