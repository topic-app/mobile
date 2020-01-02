import React from 'react';
import { ScrollView, SafeAreaView, Text } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';

import TabsNavigator from './tabs';

const DrawerComponent = () => (
  <ScrollView>
    <SafeAreaView
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <Text>Hello</Text>
    </SafeAreaView>
  </ScrollView>
);

const DrawerNavigator = createDrawerNavigator({
  Main: TabsNavigator,
}, {
  contentComponent: DrawerComponent,
});

export default DrawerNavigator;
