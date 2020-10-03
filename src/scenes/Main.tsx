import React from 'react';
import { Platform } from 'react-native';
import {
  createNativeStackNavigator,
  TransitionPresets,
  StackNavigationProp,
} from '@utils/stack';
import { connect } from 'react-redux';

import { LocationList, State } from '@ts/types';

import DisplayStackNavigator from './display/index';
import AddStackNavigator from './add/index';
import MoreStackNavigator from './more/index';
import SearchStackNavigator from './search/index';
import HomeOneNavigator from './home/HomeOne';
import ConfigureStackNavigator from './configure/index';
import ParamsStackNavigator from './params/index';
import HistoryStackNavigator from './history/index';
import UnauthorizedBeta from '@components/UnauthorizedBeta';
import NotFound from './NotFound';
import { PlatformBackButton } from '@components/index';

function getNestedParams(route?: { params: object }) {
  let { params } = route;
  while (params.params) {
    params = params.params;
  }
  return params;
}

export type MainStackParams = {
  Display: undefined;
  Configure: undefined;
  Lists: undefined;
  Add: undefined;
  More: undefined;
  Search: undefined;
  Home1: undefined;
  History: undefined;
  Params: undefined;
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<MainStackParams>();

type MainNavigatorProps = {
  navigation: StackNavigationProp<any, any>;
  location: LocationList;
};

const MainNavigator: React.FC<MainNavigatorProps> = ({ navigation, location }) => {
  if (!location.selected) {
    navigation.navigate('Landing', {
      screen: 'Welcome',
    });
  }

  return (
    <Stack.Navigator
      initialRouteName="Home1"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Display" component={DisplayStackNavigator} />
      <Stack.Screen name="Configure" component={ConfigureStackNavigator} />
      <Stack.Screen name="Params" component={ParamsStackNavigator} />
      <Stack.Screen name="Add" component={AddStackNavigator} />
      <Stack.Screen name="More" component={MoreStackNavigator} />
      <Stack.Screen name="Search" component={SearchStackNavigator} />
      <Stack.Screen name="History" component={HistoryStackNavigator} />
      <Stack.Screen name="Home1" component={HomeOneNavigator} />
      <Stack.Screen name="NotFound" component={NotFound} />
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: State) => {
  const { location } = state;
  return { location };
};

export default connect(mapStateToProps)(MainNavigator);
