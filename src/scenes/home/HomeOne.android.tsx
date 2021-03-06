/* eslint-disable import/no-unresolved */
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import { View, Platform } from 'react-native';
import { Drawer, Title, ProgressBar, Subheading, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { ErrorMessage, Avatar, Illustration, CollapsibleView, MainFeedback } from '@components';
import { fetchAccount, fetchGroups, fetchWaitingGroups } from '@redux/actions/data/account';
import { fetchLocationData } from '@redux/actions/data/location';
import getStyles from '@styles/navigators';
import { Account, LocationList, Preferences, State } from '@ts/types';
import { checkPermission, Format, Permissions, Alert, quickDevServer } from '@utils';

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

type DrawerItemAccordionProps = React.ComponentProps<typeof Drawer.Item> & {
  chevronColor: string;
};

const DrawerItemAccordion: React.FC<DrawerItemAccordionProps> = ({
  children,
  onPress,
  chevronColor,
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
        color={chevronColor}
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
  preferences: Preferences;
};

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({
  navigation,
  account,
  location,
  preferences,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const retryFetch = () => {
    fetchLocationData();
    fetchAccount();
    fetchGroups();
    fetchWaitingGroups();
  };

  const [feedbackVisible, setFeedbackVisible] = React.useState(false);

  const locationAccordionItems: React.ReactElement[] = [];
  location.schoolData.forEach((school) => {
    locationAccordionItems.push(
      <Drawer.Item key={school._id} label={school?.shortName || school?.name} icon="school" />,
    );
  });
  location.departmentData.forEach((department) => {
    locationAccordionItems.push(
      <Drawer.Item
        key={department._id}
        label={department.shortName || department.name}
        icon="home-city"
      />,
    );
  });
  if (location.global) {
    locationAccordionItems.push(<Drawer.Item key="global" icon="flag" label="France enti??re" />);
  }

  // console.log(`Location ${JSON.stringify(location)}`);
  return (
    <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
      <Drawer.Section>
        <View style={[styles.profileBackground, { marginBottom: -4 }]}>
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
                what: 'la mise ?? jour du profil',
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
          <View style={styles.profileIconContainer}>
            {account.loggedIn ? (
              <View>
                <View>
                  <Avatar
                    avatar={account.accountInfo?.user?.info.avatar}
                    size={60}
                    style={styles.avatar}
                  />
                </View>
                <Title style={styles.title} numberOfLines={1}>
                  {Format.fullUserName(account.accountInfo.user)}
                </Title>
                <Subheading
                  style={[styles.subtitle, { flex: 1 }]}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  @{account.accountInfo.user.info.username}
                </Subheading>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginRight: 10 }}>
                  <Illustration name="topic-icon" height={60} width={60} />
                </View>
                <Title style={styles.topic}>Topic</Title>
              </View>
            )}
          </View>
        </View>
      </Drawer.Section>
      {locationAccordionItems.length !== 0 ? (
        <Drawer.Section>
          {locationAccordionItems.length === 1 ? (
            locationAccordionItems[0]
          ) : (
            <DrawerItemAccordion label="Mes lieux" icon="map-marker" chevronColor={colors.icon}>
              {locationAccordionItems}
            </DrawerItemAccordion>
          )}
        </Drawer.Section>
      ) : null}
      {account.loggedIn ? (
        <Drawer.Section>
          <Drawer.Item
            label="Mon profil"
            icon="account-outline"
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Main', {
                screen: 'Display',
                params: {
                  screen: 'User',
                  params: {
                    screen: 'Display',
                    params: {
                      id: account.accountInfo?.accountId,
                      title: account.accountInfo.user?.displayName,
                    },
                  },
                },
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
          <Drawer.Item
            label="Notifications"
            icon="bell-outline"
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Main', {
                screen: 'More',
                params: { screen: 'Notifications', params: { screen: 'Notifications' } },
              });
            }}
          />
          {(checkPermission(account, {
            permission: Permissions.ARTICLE_VERIFICATION_VIEW,
            scope: {},
          }) ||
            checkPermission(account, {
              permission: Permissions.EVENT_VERIFICATION_VIEW,
              scope: {},
            }) ||
            checkPermission(account, {
              permission: Permissions.GROUP_VERIFICATION_VIEW,
              scope: {},
            }) ||
            checkPermission(account, {
              permission: Permissions.PLACE_VERIFICATION_VIEW,
              scope: {},
            })) && (
            <Drawer.Item
              label="Mod??ration"
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
            label="Cr??er un compte"
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
          label="Param??tres"
          icon="cog-outline"
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
            setFeedbackVisible(true);
          }}
        />
        <Drawer.Item
          label="?? propos"
          icon="information-outline"
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Main', {
              screen: 'More',
              params: { screen: 'About', params: { screen: 'List' } },
            });
          }}
        />
        {preferences.quickDevServer ? (
          <Drawer.Item
            label="Serveur de dev"
            icon="wrench-outline"
            onPress={() => {
              if (preferences.useDevServer) {
                Alert.alert("Red??marrez l'application pour retourner");
              } else {
                quickDevServer();
              }
            }}
          />
        ) : null}
      </Drawer.Section>
      <MainFeedback visible={feedbackVisible} setVisible={setFeedbackVisible} />
    </DrawerContentScrollView>
  );
};

const mapStateToProps = (state: State) => {
  const { account, location, preferences } = state;
  return {
    account,
    location,
    preferences,
  };
};

const CustomDrawerContentRedux = connect(mapStateToProps)(CustomDrawerContent);

function HomeOneNavigator() {
  const styles = getStyles(useTheme());
  return (
    <DrawerNav.Navigator
      initialRouteName="Home2"
      drawerContent={({ navigation }) => <CustomDrawerContentRedux navigation={navigation} />}
      drawerStyle={styles.drawerStyle}
      edgeWidth={100}
    >
      <DrawerNav.Screen name="Home2" component={HomeTwoNavigator} />
    </DrawerNav.Navigator>
  );
}

export default HomeOneNavigator;
