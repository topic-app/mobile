import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import PropTypes from 'prop-types';

import { ListHeaderConfig } from '../components/Headers';
import SettingsHomeScreen from './pages/SettingsList';
import SettingsGeneralScreen from './pages/SettingsGeneral';
import SettingsBehaviorScreen from './pages/SettingsBehavior';
import SettingsAppearanceScreen from './pages/SettingsAppearance';

const Stack = createStackNavigator();

function SettingsNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="SettingsList">
      <Stack.Screen
        name="SettingsList"
        component={SettingsHomeScreen}
        options={{
          ...ListHeaderConfig,
          title: 'Paramètres',
          primary: () => navigation.pop(),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsGeneral"
        component={SettingsGeneralScreen}
        options={{
          ...ListHeaderConfig,
          title: 'General',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsBehavior"
        component={SettingsBehaviorScreen}
        options={{
          ...ListHeaderConfig,
          title: 'Behavior',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsAppearance"
        component={SettingsAppearanceScreen}
        options={{
          ...ListHeaderConfig,
          title: 'Appearance',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;

SettingsNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
  }).isRequired,
};
