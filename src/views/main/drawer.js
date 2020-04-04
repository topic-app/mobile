import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Avatar, Title } from 'react-native-paper';

import TabsNavigator from './tabs';
import SettingsNavigator from '../settings/index';

import { navigatorStyles, colors } from '../../styles/navigatorStyles';

const DrawerNav = createDrawerNavigator();

function CustomDrawerContent({ descriptors, navigation, state }) {
  return (
    <DrawerContentScrollView>
      {/*
      <View style={navigatorStyles.profileIconContainer}>
        <MaterialIcons name="account-circle" color={colors.text} size={70} />
        <Text style={navigatorStyles.title}>Profile Name</Text>
      </View>
      <DrawerItem
        label="Paramètres"
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('Settings', { screen: 'SettingsList' });
        }}
        inactiveTintColor={colors.text}
        icon={({ color, size }) => <MaterialIcons name="settings" color={color} size={size} />}
      />
      <DrawerItem
        label="Se Déconnecter"
        onPress={() => console.log('Log out')}
        inactiveTintColor={colors.text}
        icon={({ color, size }) => <MaterialIcons name="exit-to-app" color={color} size={size} />}
      />
      */}
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
  descriptors: PropTypes.object.isRequired,
  state: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
