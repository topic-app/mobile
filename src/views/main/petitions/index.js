import React from 'react';
import { IconButton } from 'react-native-paper';

import { createStackNavigator } from '@react-navigation/stack';

import PetitionListScreen from './pages/List';
import PetitionDisplayScreen from './pages/Display';

import { colors, customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function PetitionNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="PetitionListe"
      screenOptions={customStyles.header}
    >
      <Stack.Screen
        name="PetitionListe"
        component={PetitionListScreen}
        options={{
          title: 'Pétitions',
          headerLeft: () => (
            <IconButton
              onPress={() => navigation.openDrawer()}
              icon="menu"
              color={colors.text}
              size={28}
            />
          ),
        }}
      />
      <Stack.Screen
        name="PetitionArticle"
        component={PetitionDisplayScreen}
        options={{
          title: 'Petitions: Display',
        }}
      />
    </Stack.Navigator>
  );
}

export default PetitionNavigator;
