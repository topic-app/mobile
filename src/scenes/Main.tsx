import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import NotFound from './NotFound';
import { RootScreenNavigationProp } from './Root';
import AddStackNavigator, { AddStackParams } from './add/index';
import ConfigureStackNavigator, { ConfigureStackParams } from './configure/index';
import DisplayStackNavigator, { DisplayStackParams } from './display/index';
import HistoryStackNavigator, { HistoryStackParams } from './history/index';
import HomeOneNavigator, { HomeOneNavParams } from './home/HomeOne';
import MoreStackNavigator, { MoreStackParams } from './more/index';
import PagesStackNavigator, { PagesStackParams } from './pages/index';
import ParamsStackNavigator, { ParamsStackParams } from './params/index';
import SearchStackNavigator, { SearchStackParams } from './search/index';

export type MainStackParams = {
  Display: NavigatorScreenParams<DisplayStackParams>;
  Configure: NavigatorScreenParams<ConfigureStackParams>;
  Add: NavigatorScreenParams<AddStackParams>;
  More: NavigatorScreenParams<MoreStackParams>;
  Search: NavigatorScreenParams<SearchStackParams>;
  Home1: NavigatorScreenParams<HomeOneNavParams>;
  History: NavigatorScreenParams<HistoryStackParams>;
  Params: NavigatorScreenParams<ParamsStackParams>;
  Pages: NavigatorScreenParams<PagesStackParams>;
  NotFound: undefined;
};

export type MainScreenNavigationProp<K extends keyof MainStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParams, K>,
  RootScreenNavigationProp<'Main'>
>;

const Stack = createNativeStackNavigator<MainStackParams>();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home1" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={DisplayStackNavigator} />
      <Stack.Screen name="Configure" component={ConfigureStackNavigator} />
      <Stack.Screen name="Params" component={ParamsStackNavigator} />
      <Stack.Screen name="Add" component={AddStackNavigator} />
      <Stack.Screen name="More" component={MoreStackNavigator} />
      <Stack.Screen name="Search" component={SearchStackNavigator} />
      <Stack.Screen name="Pages" component={PagesStackNavigator} />
      <Stack.Screen name="History" component={HistoryStackNavigator} />
      <Stack.Screen name="Home1" component={HomeOneNavigator} />
      <Stack.Screen name="NotFound" component={NotFound} options={{ title: 'Page non trouvée' }} />
    </Stack.Navigator>
  );
}

export default MainNavigator;
