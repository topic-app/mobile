import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Menu, IconButton } from 'react-native-paper';

import { CustomHeaderBar } from '../../components/Tools';
import ActuListScreen from './pages/List';
import ArticleDisplayScreen from './pages/Display';

import { colors } from '../../../styles/Styles';

const Stack = createStackNavigator();

class TogglableMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
  }

  openMenu = () => {
    this.setState({ menuVisible: true });
  };

  closeMenu = () => {
    console.log('close');
    this.setState({ menuVisible: false });
  };

  render() {
    const { menuVisible } = this.state;
    return (
      <Menu
        visible={menuVisible}
        onDismiss={this.closeMenu}
        anchor={
          <IconButton onPress={this.openMenu} icon="dots-vertical" color={colors.text} size={28} />
        }
      >
        <Menu.Item onPress={() => console.log('More')} title="More" />
      </Menu>
    );
  }
}

function ActuNavigator({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="ArticleList">
      <Stack.Screen
        name="ArticleList"
        component={ActuListScreen}
        options={
          {
            title: 'Actus et évènements',
            headerStyle: { backgroundColor: colors.appBar },
            headerTitleStyle: { color: colors.text },
            headerLeft: () => (
              <IconButton
                onPress={navigation.openDrawer}
                icon="menu"
                color={colors.text}
                size={28}
              />
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <IconButton
                  onPress={() => navigation.navigate('Search', { initialSelected: 'Article' })}
                  icon="magnify"
                  color={colors.text}
                  size={28}
                />
                <TogglableMenu />
              </View>
            ),
          }
          /*
          {
            title: 'Actus',
            drawer: true,
            actions: [{ icon: 'magnify', onPress: () => navigation.navigate('ArticleSearch') }],
            overflow: [{ title: 'More', onPress: () => console.log('more') }],
            header: ({ scene, previous, navigation }) => (
              <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
            ),
          }
          */
        }
      />
      <Stack.Screen
        name="ArticleDisplay"
        component={ArticleDisplayScreen}
        options={({ route }) => ({
          title: 'Actus',
          subtitle: route.params.title,
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default ActuNavigator;

ActuNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  openDrawer: PropTypes.func.isRequired,
};
