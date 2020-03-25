import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import TabsNavigator from './tabs';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen name="Main" component={TabsNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
