import React from 'react';
import { View, Text } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TabsNavigator from './tabs';
import SettingsNavigator from '../settings/index';
import { navigatorStyles, colors } from '../../styles/navigatorStyles';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ descriptors, navigation, state}) {
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
        icon={({ color, size }) => <MaterialIcons name="account-circle" color={color} size={size} />}
      />
      <DrawerItemList
        descriptors={descriptors}
        state={state}
        navigation={navigation}
        activeTintColor={colors.primary}
        inactiveTintColor={colors.text}
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
      initialRouteName="Menu Principal"
      drawerContent={CustomDrawerContent}
      drawerStyle={navigatorStyles.drawerStyle}
      edgeWidth={100}
    >
      <Drawer.Screen
        name="Menu Principal"
        component={TabsNavigator}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Paramètres"
        component={SettingsNavigator}
        options={{
          drawerIcon: ({color, size}) => {
            return <MaterialIcons name="settings" color={color} size={size} />;
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
