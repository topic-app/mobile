import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import { androidListHeaderConfig, iosListHeaderConfig } from '../../components/Headers';
import ExplorerListScreen from './pages/List';
import ExplorerDisplayScreen from './pages/Display';

import { colors } from '../../../styles/Styles';

const Stack = createStackNavigator();

function ExplorerNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="ExplorerListe">
      <Stack.Screen
        name="ExplorerListe"
        component={ExplorerListScreen}
        options={{
          title: '',
          headerTransparent: true,
          gestureEnabled: false,
          headerLeft:
            Platform.OS !== 'ios'
              ? () => (
                  <View style={{ paddingLeft: 4, paddingTop: 1.5 }}>
                    <IconButton
                      onPress={() => navigation.openDrawer()}
                      icon="menu"
                      color={colors.text}
                      size={24}
                    />
                  </View>
                )
              : undefined,
        }}
      />
      <Stack.Screen
        name="ExplorerDisplay"
        component={ExplorerDisplayScreen}
        options={
          Platform.OS === 'ios'
            ? {
                ...iosListHeaderConfig,
                title: 'Explorer:  Display',
              }
            : {
                ...androidListHeaderConfig,
                title: 'Explorer:  Display',
                drawer: true,
                actions: [
                  {
                    icon: 'magnify',
                    onPress: () => navigation.navigate('Search', { initialCategory: 'Explorer' }),
                  },
                ],
                overflow: [{ title: 'More', onPress: () => console.log('more') }],
              }
        }
      />
    </Stack.Navigator>
  );
}

export default ExplorerNavigator;

ExplorerNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
