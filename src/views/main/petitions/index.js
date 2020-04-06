import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  androidListHeaderConfig,
  iosListHeaderConfig,
  androidDisplayHeaderConfig,
  iosDisplayHeaderConfig,
} from '../../components/Headers';
import PetitionListScreen from './pages/List';
import PetitionDisplayScreen from './pages/Display';

const Stack = createStackNavigator();

function PetitionNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="PetitionListe">
      <Stack.Screen
        name="PetitionListe"
        component={PetitionListScreen}
        options={
          Platform.OS === 'ios'
            ? {
                ...iosListHeaderConfig,
                title: 'Pétitions',
              }
            : {
                ...androidListHeaderConfig,
                title: 'Pétitions',
                drawer: true,
                actions: [
                  {
                    icon: 'magnify',
                    onPress: () => navigation.navigate('Search', { initialCategory: 'Petition' }),
                  },
                ],
                overflow: [{ title: 'More', onPress: () => console.log('more') }],
              }
        }
      />
      <Stack.Screen
        name="PetitionDisplay"
        component={PetitionDisplayScreen}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                ...iosDisplayHeaderConfig,
                title: route.params.title,
              })
            : ({ route }) => ({
                ...androidDisplayHeaderConfig,
                title: 'Pétitions',
                subtitle: route.params.title,
              })
        }
      />
    </Stack.Navigator>
  );
}

export default PetitionNavigator;

PetitionNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
