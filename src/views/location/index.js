// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import LocationMapScreen from './pages/Map';
import LocationSearchScreen from './pages/Search';

const LocationNavigator = createStackNavigator({
  Map: LocationMapScreen,
  Search: LocationSearchScreen,
});

export default LocationNavigator;
