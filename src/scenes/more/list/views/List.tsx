import React from 'react';
import { View, ScrollView } from 'react-native';
import { ProgressBar, Title, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { ErrorMessage, Illustration } from '@components/index';
import { Permissions } from '@constants/index';
import { fetchLocationData } from '@redux/actions/data/location';
import getNavigatorStyles from '@styles/NavStyles';
import getStyles from '@styles/Styles';
import { Account, LocationList, State } from '@ts/types';
import { useTheme, logger, Format, checkPermission } from '@utils/index';

import { MoreScreenNavigationProp } from '../../index';

type MoreListProps = {
  navigation: MoreScreenNavigationProp<'List'>;
  location: LocationList;
  account: Account;
};

const MoreList: React.FC<MoreListProps> = ({ navigation, location, account }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigatorStyles = getNavigatorStyles(theme);

  return (
    <View style={styles.page}>
      <SafeAreaView>
        <ScrollView>
          <View style={navigatorStyles.profileBackground}>
            {(location.state.fetch.loading ||
              account.state.fetchAccount.loading ||
              account.state.fetchGroups.loading) && <ProgressBar indeterminate />}
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
                  account.state.fetchAccount.error,
                  account.state.fetchGroups.error,
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
                {account.loggedIn ? (
                  <View>
                    <Title style={[navigatorStyles.title]} ellipsizeMode="tail" numberOfLines={1}>
                      {Format.fullUserName(account.accountInfo.user)}
                    </Title>
                    <Title
                      style={[navigatorStyles.subtitle, { width: 200, marginTop: -8 }]}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      @{account.accountInfo.user.info.username}
                    </Title>
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
                title={school.shortName || school.name}
                onPress={() => {
                  logger.warn('School pressed');
                }}
              />
            ))}
            {location.departmentData.map((departement) => (
              <List.Item
                key={departement._id}
                left={() => <List.Icon icon="home-city" />}
                title={departement.shortName || departement.name}
              />
            ))}
            {location.global && (
              <List.Item left={() => <List.Icon icon="flag" />} title="France entière" />
            )}
          </List.Section>
          <Divider />
          {account.loggedIn ? (
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
    account,
    location,
  };
};

export default connect(mapStateToProps)(MoreList);
