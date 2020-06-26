import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { StackNavigationProp, LocationList, State } from '@ts/types';

import DisplayStackNavigator from './display/index';
import AddStackNavigator from './add/index';
import MoreStackNavigator from './more/index';
import SearchStackNavigator from './search/index';
import HomeOneNavigator from './home/HomeOne';
import ConfigureStackNavigator from './configure/index';
import ListsStackNavigator from './lists/index';

function getNestedParams(route?: { params: object }) {
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

type MainNavigatorProps = {
  navigation: StackNavigationProp<any, any>;
  location: LocationList;
};

const Stack = createStackNavigator();

const MainNavigator: React.FC<MainNavigatorProps> = ({ navigation, location }) => {
  if (!location.selected) {
    navigation.navigate('Landing', {
      screen: 'Welcome',
    });
  }
  return (
    <Stack.Navigator initialRouteName="Home1" headerMode="none" screenOptions={screenOptions}>
      <Stack.Screen name="Display" component={DisplayStackNavigator} />
      <Stack.Screen name="Configure" component={ConfigureStackNavigator} />
      <Stack.Screen name="Lists" component={ListsStackNavigator} />
      <Stack.Screen name="Add" component={AddStackNavigator} />
      <Stack.Screen name="More" component={MoreStackNavigator} />
      <Stack.Screen name="Search" component={SearchStackNavigator} />
      <Stack.Screen name="Home1" component={HomeOneNavigator} />
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: State) => {
  const { location } = state;
  return { location };
};

export default connect(mapStateToProps)(MainNavigator);