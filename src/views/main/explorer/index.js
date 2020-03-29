import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import { CustomHeaderBar } from '../../components/Tools';
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
          headerLeft: () => (
            <View style={{ paddingLeft: 4, paddingTop: 1.5 }}>
              <IconButton
                onPress={() => navigation.openDrawer()}
                icon="menu"
                color={colors.text}
                size={24}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ExplorerArticle"
        component={ExplorerDisplayScreen}
        options={{
          title: 'Explorer:  Display',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default ExplorerNavigator;

ExplorerNavigator.propTypes = {
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
