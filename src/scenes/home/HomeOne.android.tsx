import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, Title, ProgressBar, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import TopicIcon from '@assets/images/topic-icon.svg';

import getNavigatorStyles from '@styles/NavStyles';
import { fetchLocationData } from '@redux/actions/data/location';
import { fetchAccount, fetchGroups, fetchWaitingGroups } from '@redux/actions/data/account';
import ErrorMessage from '@components/ErrorMessage';
import HomeTwoNavigator from './HomeTwo';

const DrawerNav = createDrawerNavigator();

function genName({ data, info }) {
  if (data?.firstName && data?.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data?.firstName || data?.lastName || null;
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

  const retryFetch = () => {
    fetchLocationData();
    fetchAccount();
    fetchGroups();
    fetchWaitingGroups();
  };
  // console.log(`Location ${JSON.stringify(location)}`);
  return (
    <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
      <Drawer.Section>
        <View style={navigatorStyles.profileBackground}>
          {(location.state.fetch?.loading ||
            accountState.fetchAccount?.loading ||
            accountState.fetchGroups?.loading ||
            accountState.fetchWaitingGroups?.loading) && <ProgressBar indeterminate />}
          {(location.state.fetch?.error ||
            accountState.fetchAccount?.error ||
            accountState.fetchGroups?.error ||
            accountState.fetchWaitingGroups?.error) && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la mise à jour du profil',
                contentPlural: 'des informations de profil',
                contentSingular: 'Le profil',
              }}
              error={[
                location.state.fetch.error,
                accountState.fetchAccount.error,
                accountState.fetchGroups.error,
                accountState.fetchWaitingGroups.error,
              ]}
              retry={retryFetch}
            />
          )}
          <View style={navigatorStyles.profileIconContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {Platform.OS !== 'web' && (
                <TopicIcon
                  style={[navigatorStyles.avatar, { borderRadius: 27.5 }]}
                  height={55}
                  width={55}
                />
              )}
              {loggedIn ? (
                <View>
                  <Title
                    style={[navigatorStyles.title, { width: 200 }]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {genName(accountInfo?.user) || `@${accountInfo?.user?.info?.username || '...'}`}
                  </Title>
                  {genName(accountInfo?.user) ? (
                    <Title
                      style={[navigatorStyles.subtitle, { width: 200, marginTop: -8 }]}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      @{accountInfo?.user?.info?.username}
                    </Title>
                  ) : null}
                </View>
              ) : (
                <Title style={navigatorStyles.topic}>Topic</Title>
              )}
            </View>
          </View>
        </View>
      </Drawer.Section>
      <Drawer.Section>
        {location.schoolData.map((school) => (
          <Drawer.Item
            key={school._id}
            icon="school"
            label={school?.shortName || school?.name}
            onPress={() => {
              console.log('School pressed');
            }}
          />
        ))}
        {location.departmentData.map((departement) => (
          <Drawer.Item
            key={departement._id}
            icon="home-city"
            label={departement?.shortName || departement?.name}
          />
        ))}
        {location.global && <Drawer.Item icon="flag" label="France entière" />}
      </Drawer.Section>
      {loggedIn ? (
        <Drawer.Section>
          <Drawer.Item
            label="Mon profil"
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
            label="Mes groupes"
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
              p?.permission === 'article.verification.view' ||
              p?.permission === 'event.verification.view' ||
              p?.permission === 'petition.verification.view' ||
              p?.permission === 'place.verification.view' ||
              p?.permission === 'group.verification.view',
          ) && (
            <Drawer.Item
              label="Modération"
              icon="shield-check-outline"
              onPress={() => {
                navigation.closeDrawer();
                navigation.navigate('Main', {
                  screen: 'More',
                  params: { screen: 'Moderation', params: { screen: 'List' } },
                });
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
          label="À propos"
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
