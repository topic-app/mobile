import React from 'react';
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
        options={({ route }) => ({
          ...HeaderConfig,
          title: route.params.title || 'Actus - Aperçu',
          subtitle: route.params.title && 'Actus - Aperçu',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        })}
      />
    </Stack.Navigator>
  );
}

export default ArticleDisplayStackNavigator;
