import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import React from 'react';
import { View, Platform, Linking } from 'react-native';
import { Drawer, Title, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { ErrorMessage, Illustration } from '@components/index';
import { fetchAccount, fetchGroups, fetchWaitingGroups } from '@redux/actions/data/account';
import { fetchLocationData } from '@redux/actions/data/location';
import getNavigatorStyles from '@styles/NavStyles';
import {
  Account,
  AccountRequestState,
  DepartmentPreload,
  LocationRequestState,
  SchoolPreload,
  State,
} from '@ts/types';
import { useTheme, logger } from '@utils/index';

import HomeTwoNavigator from './HomeTwo';

const DrawerNav = createDrawerNavigator();

function genName({ data, info }) {
  if (data?.firstName && data?.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data?.firstName || data?.lastName || null;
}

type CustomDrawerContentProps = {
  navigation: DrawerNavigationProp<any, any>;
  loggedIn: boolean;
  accountInfo: Account['accountInfo'];
  accountState: AccountRequestState;
  location: {
    schoolData: SchoolPreload[];
    departmentData: DepartmentPreload[];
    global: boolean;
    state: LocationRequestState;
  };
  // TODO: Add permissions prop
};

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({
  navigation,
  accountState,
  loggedIn,
  accountInfo = { user: {} },
  location,
  permissions,
}) => {
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
                <Illustration
                  name="topic-icon"
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
              logger.warn('School pressed');
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
          label="Feedback"
          icon="message-outline"
          onPress={() => {
            navigation.closeDrawer();
            Linking.openURL('https://play.google.com/store/apps/details?id=fr.topicapp.topic');
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
};

const mapStateToProps = (state: State) => {
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

const HomeOneNavigator: React.FC<{}> = () => {
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
};

export default HomeOneNavigator;
