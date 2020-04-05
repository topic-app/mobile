import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomHeaderBar } from '../../components/Tools';
import PetitionListScreen from './pages/List';
import PetitionDisplayScreen from './pages/Display';

import { styles } from '../../../styles/Styles';
import { navigatorStyles } from '../../../styles/navigatorStyles';

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
                title: 'Pétitions',
                headerStyle: navigatorStyles.header,
                headerTitleStyle: styles.text,
              }
            : {
                title: 'Pétitions',
                drawer: true,
                actions: [
                  {
                    icon: 'magnify',
                    onPress: () => navigation.navigate('Search', { initialCategory: 'Petition' }),
                  },
                ],
                overflow: [{ title: 'More', onPress: () => console.log('more') }],
                header: ({ scene, previous, navigation }) => (
                  <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
                ),
              }
        }
      />
      <Stack.Screen
        name="PetitionDisplay"
        component={PetitionDisplayScreen}
        options={
          Platform.OS === 'ios'
            ? ({ route }) => ({
                title: route.params.title,
                headerStyle: navigatorStyles.header,
                headerTitleStyle: styles.text,
                headerBackTitleStyle: styles.text,
              })
            : ({ route }) => ({
                title: 'Pétitions',
                subtitle: route.params.title,
                header: ({ scene, previous, navigation }) => (
                  <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
                ),
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
  }).isRequired,
};
