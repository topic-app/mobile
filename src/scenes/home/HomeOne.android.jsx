import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Title, ProgressBar, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import TopicIcon from '@assets/images/topic-icon.svg';

import getNavigatorStyles from '@styles/NavStyles';
import HomeTwoNavigator from './HomeTwo';

const DrawerNav = createDrawerNavigator();

function genName({ data, info }) {
  if (data.firstName && data.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data.firstName || data.lastName || info.username;
}

function CustomDrawerContent({ navigation, loggedIn, accountInfo, location }) {
  const navigatorStyles = getNavigatorStyles(useTheme());
  console.log(`Location ${JSON.stringify(location)}`);
  return (
    <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
      <View style={navigatorStyles.profileBackground}>
        {(!location.state || location.state.loading) && <ProgressBar indeterminate />}
        <View style={navigatorStyles.profileIconContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TopicIcon
              style={[navigatorStyles.avatar, { borderRadius: 27.5 }]}
              height={55}
              width={55}
            />
            {!loggedIn && <Title>Topic</Title>}
          </View>
          {loggedIn && (
            <Title style={navigatorStyles.title} ellipsizeMode="tail" numberOfLines={1}>
              {genName(accountInfo?.user)}
            </Title>
          )}
        </View>
      </View>
      <Drawer.Section style={navigatorStyles.locationBackground}>
        {location.schoolData.map((school) => (
          <Drawer.Item
            key={school?._id}
            icon="school"
            label={school?.shortName || school?.name}
            onPress={() => {
              console.log('School pressed');
            }}
          />
        ))}
        {location.departmentData.map((departement) => (
          <Drawer.Item
            key={departement?._id}
            icon="home-city"
            label={departement?.shortName || departement?.name}
          />
        ))}
        {location.global && <Drawer.Item icon="flag" label="France entière" />}
      </Drawer.Section>
      {loggedIn ? (
        <Drawer.Section>
          <Drawer.Item
            label="Mon Profil"
            icon="account-outline"
            onPress={() => {
              navigation.closeDrawer();
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
              navigation.closeDrawer();
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
              navigation.closeDrawer();
              navigation.navigate('Auth', {
                screen: 'Login',
              });
            }}
          />
          <Drawer.Item
            label="Créer un compte"
            icon="account-plus-outline"
            onPress={() => {
              navigation.closeDrawer();
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
          onPress={() => Linking.openURL('https://gitlab.com/topicapp/issues/issues')}
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
  const { account, location } = state;
  return { accountInfo: account.accountInfo, loggedIn: account.loggedIn, location };
};

const CustomDrawerContentRedux = connect(mapStateToProps)(CustomDrawerContent);

function HomeOneNavigator() {
  const navigatorStyles = getNavigatorStyles(useTheme());
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

export default HomeOneNavigator;

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
  location: PropTypes.shape({
    schoolData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    departmentData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    global: PropTypes.bool.isRequired,
    state: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }),
  }).isRequired,
};
