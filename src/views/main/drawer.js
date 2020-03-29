import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TabsNavigator from './tabs';

import { navigatorStyles, colors } from '../../styles/navigatorStyles';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ descriptors, navigation, state }) {
  return (
    <DrawerContentScrollView>
      <View style={navigatorStyles.profileIconContainer}>
        <MaterialIcons name="account-circle" color={colors.text} size={70} />
        <Text style={navigatorStyles.title}>Profile Name</Text>
      </View>
      <DrawerItem
        label="Compte"
        onPress={() => console.log('Compte')}
        inactiveTintColor={colors.text}
        icon={({ color, size }) => (
          <MaterialIcons name="account-circle" color={color} size={size} />
        )}
      />
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
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}
      drawerStyle={navigatorStyles.drawerStyle}
      edgeWidth={90}
    >
      <Drawer.Screen
        name="Home"
        component={TabsNavigator}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
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
    closeDrawer: PropTypes.func,
  }).isRequired,
};
