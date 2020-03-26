import React from 'react';
import { IconButton } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import CarteListScreen from './pages/List';
import CarteDisplayScreen from './pages/Display';

import { colors, customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function CarteNavigator({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="CarteListe"
      screenOptions={customStyles.header}
    >
      <Stack.Screen
        name="CarteListe"
        component={CarteListScreen}
        options={{
          title: '',
          headerTransparent: true,
          gestureEnabled: false,
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
        name="CarteArticle"
        component={CarteDisplayScreen}
        options={{
          title: 'Carte:  Display',
        }}
      />
    </Stack.Navigator>
  );
}

export default CarteNavigator;
