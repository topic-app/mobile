import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomHeaderBar } from '../../components/Tools';
import CarteListScreen from './pages/List';
import CarteDisplayScreen from './pages/Display';

import { colors, customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function CarteNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="CarteListe">
      <Stack.Screen
        name="CarteListe"
        component={CarteListScreen}
        options={{
          title: '',
          headerTransparent: true,
          gestureEnabled: false,
          headerLeft: () => (
            <View style={{ paddingLeft: 3 }}>
              <IconButton
                onPress={() => navigation.openDrawer()}
                icon="menu"
                color={colors.text}
                size={25}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="CarteArticle"
        component={CarteDisplayScreen}
        options={{
          title: 'Carte:  Display',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default CarteNavigator;

CarteNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
