import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { connect } from 'react-redux';

import { LocationList, State } from '@ts/types';
import { createNativeStackNavigator } from '@utils/stack';

import NotFound from './NotFound';
import { RootNavParams } from './Root';
import AddStackNavigator from './add/index';
import ConfigureStackNavigator from './configure/index';
import DisplayStackNavigator, { DisplayStackParams } from './display/index';
import HistoryStackNavigator from './history/index';
import HomeOneNavigator from './home/HomeOne';
import MoreStackNavigator from './more/index';
import ParamsStackNavigator from './params/index';
import SearchStackNavigator from './search/index';

export type MainStackParams = {
  Display: {
    screen: keyof DisplayStackParams;
    params: DisplayStackParams[keyof DisplayStackParams];
  };
  Configure: undefined;
  Lists: undefined;
  Add: undefined;
  More: undefined;
  Search: undefined;
  Home1: undefined;
  History: undefined;
  Params: undefined;
  NotFound: undefined;
} & RootNavParams;

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
