import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomHeaderBar } from '../../components/Tools';
import ActuListScreen from './pages/List';
import ArticleDisplayScreen from './pages/Display';

import { styles } from '../../../styles/Styles';
import { navigatorStyles } from '../../../styles/navigatorStyles';

const Stack = createStackNavigator();

function ActuNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="ArticleList">
      <Stack.Screen
        name="ArticleList"
        component={ActuListScreen}
        options={
          Platform.OS === 'ios'
            ? {
                title: 'Actualités',
                headerStyle: navigatorStyles.header,
                headerTitleStyle: styles.text,
              }
            : {
                title: 'Actus',
                drawer: true,
                actions: [
                  {
                    icon: 'magnify',
                    onPress: () => navigation.navigate('Search', { initialCategory: 'Article' }),
                  },
                ],
                overflow: [{ title: 'More', onPress: () => console.log('more') }],
                header: ({ scene, previous, navigation }) => (
                  <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
                ),
              }
        }
      />
      <Stack.Screen
        name="ArticleDisplay"
        component={ArticleDisplayScreen}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                title: route.params.title,
                headerStyle: navigatorStyles.header,
                headerTitleStyle: styles.text,
                headerBackTitleStyle: styles.text,
              })
            : ({ route }) => ({
                title: 'Actus',
                subtitle: route.params.title,
                header: ({ scene, previous, navigation }) => (
                  <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
                ),
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
