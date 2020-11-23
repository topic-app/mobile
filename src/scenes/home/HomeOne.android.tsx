/* eslint-disable import/no-unresolved */
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import { View, Linking } from 'react-native';
import { Drawer, Title, ProgressBar, Subheading } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { ErrorMessage, Avatar, Illustration, CollapsibleView } from '@components/index';
import { fetchAccount, fetchGroups, fetchWaitingGroups } from '@redux/actions/data/account';
import { fetchLocationData } from '@redux/actions/data/location';
import getNavigatorStyles from '@styles/NavStyles';
import { Account, AccountUser, LocationList, State } from '@ts/types';
import { useTheme, logger } from '@utils/index';

import { MainScreenNavigationProp } from '../Main';
import HomeTwoNavigator, { HomeTwoNavParams } from './HomeTwo';

export type HomeOneNavParams = {
  Home2: NavigatorScreenParams<HomeTwoNavParams>;
};

export type HomeOneScreenNavigationProp<K extends keyof HomeOneNavParams> = CompositeNavigationProp<
  DrawerNavigationProp<HomeOneNavParams, K>,
  MainScreenNavigationProp<'Home1'>
>;

const DrawerNav = createDrawerNavigator<HomeOneNavParams>();

function genFullUserName(user: AccountUser) {
  const { firstName, lastName } = user.data;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return user.displayName;
}

type DrawerItemAccordionProps = React.ComponentProps<typeof Drawer.Item>;

const DrawerItemAccordion: React.FC<DrawerItemAccordionProps> = ({
  children,
  onPress,
  ...rest
}) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <View>
      <Drawer.Item
        {...rest}
        onPress={() => {
          setExpanded(!expanded);
          onPress?.();
        }}
      />
      <Icon
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={23}
        style={{
          position: 'absolute',
          right: 16,
          top: 14,
        }}
      />
      <CollapsibleView collapsed={!expanded}>{children}</CollapsibleView>
    </View>
  );
};

type CustomDrawerContentProps = {
  navigation: DrawerNavigationHelpers;
  account: Account;
  location: LocationList;
  // TODO: Add permissions prop
};

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({
  navigation,
  account,
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
            account.state.fetchAccount?.loading ||
            account.state.fetchGroups?.loading ||
            account.state.fetchWaitingGroups?.loading) && <ProgressBar indeterminate />}
          {(location.state.fetch?.error ||
            account.state.fetchAccount?.error ||
            account.state.fetchGroups?.error ||
            account.state.fetchWaitingGroups?.error) && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la mise à jour du profil',
                contentPlural: 'des informations de profil',
                contentSingular: 'Le profil',
              }}
              error={[
                location.state.fetch.error,
                account.state.fetchAccount.error,
                account.state.fetchGroups.error,
                account.state.fetchWaitingGroups.error,
              ]}
              retry={retryFetch}
            />
          )}
          <View style={navigatorStyles.profileIconContainer}>
            {account.loggedIn ? (
              <View>
                <View>
                  <Avatar
                    avatar={account.accountInfo?.user?.info.avatar}
                    size={60}
                    style={navigatorStyles.avatar}
                  />
                </View>
                <Title style={navigatorStyles.title} numberOfLines={1}>
                  {genFullUserName(account.accountInfo.user)}
                </Title>
                <Subheading
                  style={[navigatorStyles.subtitle, { flex: 1 }]}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  @{account.accountInfo.user.info.username}
                </Subheading>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Illustration
                  name="topic-icon"
                  height={60}
                  width={60}
                  style={[navigatorStyles.avatar, { borderRadius: 30 }]}
                />
                <Title style={navigatorStyles.topic}>Topic</Title>
              </View>
            )}
          </View>
        </View>
      </Drawer.Section>
      <Drawer.Section>
        <DrawerItemAccordion label="Mes lieux" icon="map-marker">
          {location.schoolData.map((school) => (
            <Drawer.Item
              key={school._id}
              label={school?.shortName || school?.name}
              icon="school"
              onPress={() => logger.debug('School pressed in drawer')}
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
        </DrawerItemAccordion>
      </Drawer.Section>
      {account.loggedIn ? (
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
          icon="comment-outline"
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
    account,
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
