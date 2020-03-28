import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';

import { CustomHeaderBar } from '../components/Tools';
import SettingsHomeScreen from './pages/SettingsList';
import SettingsGeneralScreen from './pages/SettingsGeneral';
import SettingsBehaviorScreen from './pages/SettingsBehavior';
import SettingsAppearanceScreen from './pages/SettingsAppearance';

import { colors, customStyles } from '../../styles/Styles';

const Stack = createStackNavigator();

function SettingsNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="SettingsList">
      <Stack.Screen
        name="SettingsList"
        component={SettingsHomeScreen}
        options={{
          title: 'Paramètres',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar drawer scene={scene} previous={previous} navigation={navigation} />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsGeneral"
        component={SettingsGeneralScreen}
        options={{
          title: 'General',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsBehavior"
        component={SettingsBehaviorScreen}
        options={{
          title: 'Behavior',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SettingsAppearance"
        component={SettingsAppearanceScreen}
        options={{
          title: 'Appearance',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
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
  }).isRequired,
};
