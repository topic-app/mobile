import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { ListHeaderConfig, DisplayHeaderConfig } from '../../components/Headers';
import ActuListScreen from './pages/List';
import ArticleDisplayScreen from './pages/Display';

const Stack = createStackNavigator();

function ActuNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="ArticleList">
      <Stack.Screen
        name="ArticleList"
        component={ActuListScreen}
        options={{
          ...ListHeaderConfig,
          title: Platform.OS === 'ios' ? 'Actualités' : 'Actus',
          drawer: true,
          actions: [
            {
              icon: 'magnify',
              onPress: () => navigation.navigate('Search', { initialCategory: 'Article' }),
            },
          ],
          overflow: [{ title: 'More', onPress: () => console.log('more') }],
        }}
      />
      <Stack.Screen
        name="ArticleDisplay"
        component={ArticleDisplayScreen}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                ...DisplayHeaderConfig,
                title: route.params.title,
              })
            : ({ route }) => ({
                ...DisplayHeaderConfig,
                title: 'Actus',
                subtitle: route.params.title,
              })
        }
      />
    </Stack.Navigator>
  );
}

export default ActuNavigator;

ActuNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
