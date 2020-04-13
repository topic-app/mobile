import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MoreList from './list/views/List'; // This is the iOS 'more' menu (equivalent to drawer in Android)
import ProfileStackNavigator from './profile/index';
import SettingsStackNavigator from './settings/index';
import MyGroupStackNavigator from './myGroups/index';
import AboutStackNavigator from './about/index';

const Stack = createStackNavigator();

function MoreStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="none">
      <Stack.Screen name="Profile" component={ProfileStackNavigator} />
      <Stack.Screen name="Settings" component={SettingsStackNavigator} />
      <Stack.Screen name="List" component={MoreList} />
      <Stack.Screen name="MyGroups" component={MyGroupStackNavigator} />
      <Stack.Screen name="About" component={AboutStackNavigator} />
    </Stack.Navigator>
  );
}

export default MoreStackNavigator;
