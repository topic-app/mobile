import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Avatar, Title, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import getNavigatorStyles from '@styles/NavStyles';

import HomeTwoNavigator from './HomeTwo';

const DrawerNav = createDrawerNavigator();

function genName({ data, info }) {
  if (data.firstName && data.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data.firstName || data.lastName || info.username;
}

function CustomDrawerContent({ navigation, loggedIn, accountInfo, theme }) {
  const navigatorStyles = getNavigatorStyles(theme);
  return (
    <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
      <View style={navigatorStyles.profileBackground}>
        {loggedIn && (
          <View style={navigatorStyles.profileIconContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image
                size={55}
                style={[navigatorStyles.avatar, { marginRight: 10 }]}
                source={{ uri: 'https://i.picsum.photos/id/1005/400/400.jpg' }}
              />
              {/*
              <FlatList
                horizontal
                scrollEnabled={false}
                data={[
                  { groupId: '1', thumbnailUrl: 'https://picsum.photos/seed/1/200/200' },
                  { groupId: '2', thumbnailUrl: 'https://picsum.photos/seed/2/200/200' },
                  { groupId: '3', thumbnailUrl: 'https://picsum.photos/seed/3/200/200' },
                ]}
                keyExtractor={(group) => group.groupId}
                style={{ marginVertical: 7 }}
                renderItem={({ item, index }) => (
                  <View style={{ marginLeft: index === 0 ? 0 : -8 }} key={item.groupId}>
                    <Avatar.Image size={30} source={{ uri: item.thumbnailUrl }} />
                  </View>
                )}
              />
              */}
            </View>

            <Title style={navigatorStyles.title} ellipsizeMode="tail" numberOfLines={1}>
              {genName(accountInfo.user)}
            </Title>
          </View>
        )}
      </View>
      <Drawer.Section style={{ marginTop: -4 }} />
      {loggedIn ? (
        <Drawer.Section>
          <Drawer.Item
            label="Mon Profil"
            icon="account-outline"
            onPress={() => {
              navigation.navigate('Main', {
                screen: 'More',
                params: { screen: 'Profile', params: { screen: 'Profile' } },
              });
            }}
          />
          <Drawer.Item
            label="Mes Groupes"
            icon="account-group-outline"
            onPress={() => {
              navigation.navigate('Main', {
                screen: 'More',
                params: { screen: 'MyGroups', params: { screen: 'List' } },
              });
            }}
          />
          <Drawer.Item
            label="Modération"
            icon="shield-check-outline"
            onPress={() => {
              console.log('Moderation');
            }}
          />
        </Drawer.Section>
      ) : (
        <Drawer.Section>
          <Drawer.Item
            label="Se connecter"
            icon="account-outline"
            onPress={() => {
              navigation.navigate('Auth', {
                screen: 'Login',
              });
            }}
          />
          <Drawer.Item
            label="Créer un compte"
            icon="account-plus-outline"
            onPress={() => {
              navigation.navigate('Auth', {
                screen: 'Create',
              });
            }}
          />
        </Drawer.Section>
      )}
      <Drawer.Section>
        <Drawer.Item
          label="Paramètres"
          icon="settings-outline"
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Main', {
              screen: 'More',
              params: { screen: 'Settings', params: { screen: 'List' } },
            });
          }}
        />
        <Drawer.Item
          label="Signaler un bug"
          icon="gitlab"
          onPress={() => Linking.openURL('https://gitlab.com/')}
        />
        <Drawer.Item
          label="A Propos"
          icon="information-outline"
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Main', {
              screen: 'More',
              params: { screen: 'About', params: { screen: 'List' } },
            });
          }}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}

const mapStateToProps = (state) => {
  const { account } = state;
  return { accountInfo: account.accountInfo, loggedIn: account.loggedIn };
};

const CustomDrawerContentRedux = connect(mapStateToProps)(withTheme(CustomDrawerContent));

function HomeOneNavigator({ theme }) {
  const navigatorStyles = getNavigatorStyles(theme);
  return (
    <DrawerNav.Navigator
      initialRouteName="Home2"
      drawerContent={({ navigation }) => <CustomDrawerContentRedux navigation={navigation} />}
      drawerStyle={navigatorStyles.drawerStyle}
      edgeWidth={90}
    >
      <DrawerNav.Screen name="Home2" component={HomeTwoNavigator} />
    </DrawerNav.Navigator>
  );
}

HomeOneNavigator.propTypes = {
  theme: PropTypes.shape({}).isRequired,
};

export default withTheme(HomeOneNavigator);

CustomDrawerContent.defaultProps = {
  accountInfo: {
    user: {},
  },
};

CustomDrawerContent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
  loggedIn: PropTypes.bool.isRequired,
  accountInfo: PropTypes.shape({
    user: PropTypes.shape({
      // Todo
    }),
  }),
  theme: PropTypes.shape({}).isRequired,
};
