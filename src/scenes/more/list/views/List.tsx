import React from 'react';
import { View, ScrollView } from 'react-native';
import { ProgressBar, Title, List, Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import {
  Account,
  AccountRequestState,
  DepartmentPreload,
  LocationRequestState,
  SchoolPreload,
  State,
} from '@ts/types';
import { ErrorMessage, Illustration } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import getNavigatorStyles from '@styles/NavStyles';
import { fetchLocationData } from '@redux/actions/data/location';

function genName({ data, info }) {
  if (data?.firstName && data?.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data?.firstName || data?.lastName || null;
}

type MoreListProps = {
  navigation: StackNavigationProp<any, any>;
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

const MoreList: React.FC<MoreListProps> = ({
  navigation,
  location,
  accountInfo,
  permissions,
  accountState,
  loggedIn,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigatorStyles = getNavigatorStyles(theme);

  return (
    <View style={styles.page}>
      <SafeAreaView>
        <ScrollView>
          <View style={navigatorStyles.profileBackground}>
            {(location.state.fetch.loading ||
              accountState.fetchAccount.loading ||
              accountState.fetchGroups.loading) && <ProgressBar indeterminate />}
            {location.state.fetch.error && (
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
                ]}
                retry={fetchLocationData}
              />
            )}
            <View style={navigatorStyles.profileIconContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Illustration
                  name="topic-icon"
                  style={[navigatorStyles.avatar, { borderRadius: 27.5 }]}
                  height={55}
                  width={55}
                />
                {loggedIn ? (
                  <View>
                    <Title style={[navigatorStyles.title]} ellipsizeMode="tail" numberOfLines={1}>
                      {genName(accountInfo?.user) ||
                        `@${accountInfo?.user?.info?.username || '...'}`}
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
          <Divider />
          <List.Section>
            {location.schoolData.map((school) => (
              <List.Item
                key={school._id}
                left={() => <List.Icon icon="school" />}
                title={school?.shortName || school?.name}
                onPress={() => {
                  console.log('School pressed');
                }}
              />
            ))}
            {location.departmentData.map((departement) => (
              <List.Item
                key={departement._id}
                left={() => <List.Icon icon="home-city" />}
                title={departement?.shortName || departement?.name}
              />
            ))}
            {location.global && <List.Item icon="flag" title="France entière" />}
          </List.Section>
          <Divider />
          {loggedIn ? (
            <List.Section>
              <List.Item
                title="Mon profil"
                left={() => <List.Icon icon="account-outline" />}
                onPress={() => {
                  navigation.navigate('Main', {
                    screen: 'More',
                    params: { screen: 'Profile', params: { screen: 'Profile' } },
                  });
                }}
              />
              <List.Item
                title="Mes groupes"
                left={() => <List.Icon icon="account-group-outline" />}
                onPress={() => {
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
                <List.Item
                  title="Modération"
                  left={() => <List.Icon icon="shield-check-outline" />}
                  onPress={() => {
                    navigation.navigate('Main', {
                      screen: 'More',
                      params: { screen: 'Moderation', params: { screen: 'List' } },
                    });
                  }}
                />
              )}
            </List.Section>
          ) : (
            <List.Section>
              <List.Item
                title="Se connecter"
                left={() => <List.Icon icon="account-outline" />}
                onPress={() => {
                  navigation.navigate('Auth', {
                    screen: 'Login',
                  });
                }}
              />
              <List.Item
                title="Créer un compte"
                left={() => <List.Icon icon="account-plus-outline" />}
                onPress={() => {
                  navigation.navigate('Auth', {
                    screen: 'Create',
                  });
                }}
              />
            </List.Section>
          )}
          <Divider />
          <List.Section>
            <List.Item
              title="Paramètres"
              left={() => <List.Icon icon="settings-outline" />}
              onPress={() => {
                navigation.navigate('Main', {
                  screen: 'More',
                  params: { screen: 'Settings', params: { screen: 'List' } },
                });
              }}
            />
            <List.Item
              title="À propos"
              left={() => <List.Icon icon="information-outline" />}
              onPress={() => {
                navigation.navigate('Main', {
                  screen: 'More',
                  params: { screen: 'About', params: { screen: 'List' } },
                });
              }}
            />
          </List.Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, location } = state;
  return {
    accountInfo: account.accountInfo,
    permissions: account.permissions,
    accountState: account.state,
    location,
    loggedIn: account.loggedIn,
  };
};

export default connect(mapStateToProps)(MoreList);
