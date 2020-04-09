import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import PropTypes from 'prop-types';

import { ListHeaderConfig } from '../components/Headers';
import SettingsHomeScreen from './pages/SettingsList';

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
          primary: () => navigation.goBack(),
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
