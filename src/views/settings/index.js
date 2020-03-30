import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import PropTypes from 'prop-types';

import { CustomHeaderBar } from '../components/Tools';
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
          title: 'Paramètres',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar
              scene={scene}
              customRoute={[
                'Main',
                { screen: 'Home', params: { screen: 'Actus', params: { screen: 'ActuListe' } } },
              ]}
              navigation={navigation}
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
