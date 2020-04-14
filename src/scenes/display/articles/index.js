import React from 'react';
import { Platform, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
