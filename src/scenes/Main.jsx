import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { connect } from 'react-redux';

import DisplayStackNavigator from './display/index';
import AddStackNavigator from './add/index';
import MoreStackNavigator from './more/index';
import SearchStackNavigator from './search/index';
import HomeOneNavigator from './home/HomeOne';
import ConfigureStackNavigator from './configure/index';

function getNestedParams(route) {
  let { params } = route;
  while (params.params) {
    params = params.params;
  }
  return params;
}

let screenOptions = TransitionPresets.SlideFromRightIOS;
if (Platform.OS === 'ios') {
  screenOptions = ({ route }) => {
    if (route.params && getNestedParams(route).noTransition) {
      return {
        cardStyleInterpolator: () => ({ cardStyle: null }),
      };
    }
    return null;
  };
}

const Stack = createStackNavigator();

function MainNavigator({ navigation, location }) {
  if (!location.selected) {
    navigation.navigate('Landing', {
      screen: 'Welcome',
    });
  }
  return (
    <Stack.Navigator initialRouteName="Home1" headerMode="none" screenOptions={screenOptions}>
      <Stack.Screen name="Display" component={DisplayStackNavigator} />
      <Stack.Screen name="Configure" component={ConfigureStackNavigator} />
      <Stack.Screen name="Add" component={AddStackNavigator} />
      <Stack.Screen name="More" component={MoreStackNavigator} />
      <Stack.Screen name="Search" component={SearchStackNavigator} />
      <Stack.Screen name="Home1" component={HomeOneNavigator} />
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => {
  const { location } = state;
  return { location };
};

MainNavigator.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
  location: PropTypes.shape({
    selected: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps)(MainNavigator);
