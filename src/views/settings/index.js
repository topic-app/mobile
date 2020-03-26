import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';

import SettingsHomeScreen from './pages/SettingsList';
import SettingsGeneralScreen from './pages/SettingsGeneral';
import SettingsBehaviorScreen from './pages/SettingsBehavior';
import SettingsAppearanceScreen from './pages/SettingsAppearance';

import { colors, customStyles } from '../../styles/Styles';

const Stack = createStackNavigator();

function SettingsNavigator({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="SettingsList"
      screenOptions={customStyles.header}
    >
      <Stack.Screen
        name="SettingsList"
        component={SettingsHomeScreen}
        options={{
          title: 'Paramètres',
          headerLeft: () => (
            <IconButton
              onPress={() => navigation.goBack()}
              icon="arrow-left"
              color={colors.text}
              size={28}
            />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsGeneral"
        component={SettingsGeneralScreen}
        options={{
          title: 'General',
          headerLeft: () => (
            <IconButton
              onPress={() => navigation.goBack()}
              icon="arrow-left"
              color={colors.text}
              size={28}
            />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsBehavior"
        component={SettingsBehaviorScreen}
        options={{
          title: 'Behavior',
          headerLeft: () => (
            <IconButton
              onPress={() => navigation.goBack()}
              icon="arrow-left"
              color={colors.text}
              size={28}
            />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsAppearance"
        component={SettingsAppearanceScreen}
        options={{
          title: 'Appearance',
          headerLeft: () => (
            <IconButton
              onPress={() => navigation.goBack()}
              icon="arrow-left"
              color={colors.text}
              size={28}
            />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
