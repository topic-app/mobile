import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text } from 'react-native';

import { TouchableNativeFeedback } from 'react-native-gesture-handler';

import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Avatar, Title } from 'react-native-paper';

import TabsNavigator from './tabs.android';

import { navigatorStyles } from '../../styles/navigatorStyles';

const DrawerNav = createDrawerNavigator();

const groups = [
  { groupId: 1, thumbnailUrl: 'https://picsum.photos/seed/1/200/200' },
  { groupId: 2, thumbnailUrl: 'https://picsum.photos/seed/2/200/200' },
  { groupId: 3, thumbnailUrl: 'https://picsum.photos/seed/3/200/200' },
  { groupId: 4, thumbnailUrl: 'https://picsum.photos/seed/4/200/200' },
  { groupId: 5, thumbnailUrl: 'https://picsum.photos/seed/5/200/200' },
  { groupId: 6, thumbnailUrl: 'https://picsum.photos/seed/6/200/200' },
  { groupId: 7, thumbnailUrl: 'https://picsum.photos/seed/7/200/200' },
  { groupId: 8, thumbnailUrl: 'https://picsum.photos/seed/8/200/200' },
  { groupId: 9, thumbnailUrl: 'https://picsum.photos/seed/9/200/200' },
  { groupId: 10, thumbnailUrl: 'https://picsum.photos/seed/10/200/200' },
];

function CustomDrawerContent({ navigation }) {
  return (
    <DrawerContentScrollView>
      <Drawer.Section>
        <View style={navigatorStyles.profileIconContainer}>
          <Avatar.Image size={55} source={{ uri: 'https://i.picsum.photos/id/1005/400/400.jpg' }} />
          <Title style={navigatorStyles.title} ellipsizeMode="tail" numberOfLines={1}>
            Christophe de Carcasonne
          </Title>
        </View>
      </Drawer.Section>
      <Drawer.Section>
        <FlatList
          horizontal
          data={groups}
          style={{ marginBottom: 10 }}
          renderItem={({ item, index }) => (
            <View style={{ marginLeft: index === 0 ? 10 : -8 }} key={item.groupId}>
              <Avatar.Image size={30} source={{ uri: item.thumbnailUrl }} />
            </View>
          )}
        />
        <Drawer.Item
          label="Mes Groupes"
          icon="check"
          onPress={() => {
            console.log('Moderation');
          }}
        />
        <Drawer.Item
          label="Modération"
          icon="check"
          onPress={() => {
            console.log('Moderation');
          }}
        />
        <Drawer.Item
          label="Paramètres"
          icon="settings"
          onPress={() => {
            navigation.closeDrawer();
            navigation.push('Settings');
          }}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <DrawerNav.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}
      drawerStyle={navigatorStyles.drawerStyle}
      edgeWidth={90}
    >
      <DrawerNav.Screen name="Home" component={TabsNavigator} />
    </DrawerNav.Navigator>
  );
}

export default DrawerNavigator;

CustomDrawerContent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
