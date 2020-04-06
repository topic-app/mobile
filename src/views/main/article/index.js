import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { CustomHeaderBar } from '../../components/Tools';
import ActuListScreen from './pages/List';
import ArticleDisplayScreen from './pages/Display';

import { styles } from '../../../styles/Styles';
import { navigatorStyles } from '../../../styles/navigatorStyles';

const zoomInTransitionPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        damping: 1000,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        stiffness: 900,
      },
    },
    close: {
      animation: 'spring',
      config: {
        damping: 1000,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        stiffness: 900,
      },
    },
  },
  cardStyleInterpolator: ({ current, next }) => {
    return {
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                })
              : 1,
          },
        ],
        opacity: current.progress,
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const slideRightTransitionPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        damping: 1000,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        stiffness: 900,
      },
    },
    close: {
      animation: 'spring',
      config: {
        damping: 1000,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        stiffness: 900,
      },
    },
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                })
              : 1,
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.9],
        }),
      },
    };
  },
};

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
                ...slideRightTransitionPreset,
                // ...zoomInTransitionPreset,
                // ...TransitionPresets.SlideFromRightIOS,
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
                ...slideRightTransitionPreset,
                // ...zoomInTransitionPreset,
                // ...TransitionPresets.SlideFromRightIOS,
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
