import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Avatar, Title } from 'react-native-paper';

import TabsNavigator from './tabs.android';

import { navigatorStyles } from '../../styles/navigatorStyles';

const DrawerNav = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  return (
    <DrawerContentScrollView>
      <Drawer.Section>
        <View style={navigatorStyles.profileIconContainer}>
          <Avatar.Text size={50} label="MV" />
          <Title style={navigatorStyles.title}>Profile Name</Title>
        </View>
      </Drawer.Section>
      <Drawer.Section>
        <Drawer.Item
          label="Modération"
          icon="check"
          onPress={() => {
            console.log('Moderation');
          }}
        />
        <Drawer.Item
          label="Paramètres"
          icon="settings"
          onPress={() => {
            navigation.closeDrawer();
            navigation.push('Settings');
          }}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <DrawerNav.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}
      drawerStyle={navigatorStyles.drawerStyle}
      edgeWidth={90}
    >
      <DrawerNav.Screen name="Home" component={TabsNavigator} />
    </DrawerNav.Navigator>
  );
}

export default DrawerNavigator;

CustomDrawerContent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
