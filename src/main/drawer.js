import React, { Component } from 'react';
import { ScrollView, SafeAreaView, Text } from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { DrawerItems } from 'react-navigation-drawer';
import { List } from 'react-native-paper'

import TabsNavigator from './tabs.js'

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
})

export default DrawerNavigator
