import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Title, ProgressBar, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import TopicIcon from '@assets/images/topic-icon.svg';

import getNavigatorStyles from '@styles/NavStyles';
import { fetchLocationData } from '@redux/actions/data/location';
import ErrorMessage from '@components/ErrorMessage';
import HomeTwoNavigator from './HomeTwo';

const DrawerNav = createDrawerNavigator();

function genName({ data, info }) {
  if (data.firstName && data.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data.firstName || data.lastName || info.username;
}

function CustomDrawerContent({
  navigation,
  accountState,
  loggedIn,
  accountInfo,
  location,
  permissions,
}) {
  const navigatorStyles = getNavigatorStyles(useTheme());
  // console.log(`Location ${JSON.stringify(location)}`);
  return (
    <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
      <Drawer.Section>
        <View style={navigatorStyles.profileBackground}>
          {(location.state.fetch.loading ||
            accountState.fetchAccount.loading ||
            accountState.fetchGroups.loading) && <ProgressBar indeterminate />}
          {location.state.fetch.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la récupération des articles',
                contentPlural: 'des articles',
                contentSingular: "La liste d'articles",
              }}
              error={[
                location.state.fetch.error,
                accountState.fetchAccount.error,
                accountState.fetchGroups.error,
              ]}
              retry={fetchLocationData}
            />
          )}
          <View style={navigatorStyles.profileIconContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TopicIcon
                style={[navigatorStyles.avatar, { borderRadius: 27.5 }]}
                height={55}
                width={55}
              />
              {!loggedIn && <Title style={navigatorStyles.title}>Topic</Title>}
            </View>
            {loggedIn && (
              <Title style={navigatorStyles.title} ellipsizeMode="tail" numberOfLines={1}>
                {genName(accountInfo?.user)}
              </Title>
            )}
          </View>
        </View>
      </Drawer.Section>
      <Drawer.Section>
        {location.schoolData.map((school) => (
          <Drawer.Item
            key={school._id}
            icon="school"
            label={school.shortName || school.name}
            onPress={() => {
              console.log('School pressed');
            }}
          />
        ))}
        {location.departmentData.map((departement) => (
          <Drawer.Item
            key={departement._id}
            icon="home-city"
            label={departement.shortName || departement.name}
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
          {permissions?.some(
            (p) =>
              p.name === 'article.verification.view' ||
              p.name === 'event.verification.view' ||
              p.name === 'petition.verification.view' ||
              p.name === 'place.verification.view' ||
              p.name === 'group.verification.view',
          ) && (
            <Drawer.Item
              label="Modération"
              icon="shield-check-outline"
              onPress={() => {
                console.log('Moderation');
              }}
            />
          )}
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
  return {
    accountInfo: account.accountInfo,
    accountState: account.state,
    permissions: account.permissions,
    loggedIn: account.loggedIn,
    location,
  };
};

const CustomDrawerContentRedux = connect(mapStateToProps)(CustomDrawerContent);

function HomeOneNavigator() {
  const navigatorStyles = getNavigatorStyles(useTheme());
  return (
    <DrawerNav.Navigator
      initialRouteName="Home2"
      drawerContent={({ navigation }) => <CustomDrawerContentRedux navigation={navigation} />}
      drawerStyle={navigatorStyles.drawerStyle}
      edgeWidth={100}
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
  accountState: PropTypes.shape({
    fetchAccount: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.oneOf([PropTypes.object, null]), // TODO: Better PropTypes
    }).isRequired,
    fetchGroups: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.oneOf([PropTypes.object, null]), // TODO: Better PropTypes
    }).isRequired,
  }),
  location: PropTypes.shape({
    schoolData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    departmentData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    global: PropTypes.bool.isRequired,
    state: PropTypes.shape({
      fetch: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.oneOf([PropTypes.object, null]), // TODO: Better PropTypes
      }).isRequired,
    }),
  }).isRequired,
};
