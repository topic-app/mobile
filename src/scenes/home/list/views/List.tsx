import React from 'react';
import { View, ScrollView } from 'react-native';
import { ProgressBar, Title, List, Divider, Subheading } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { Avatar, ErrorMessage, Illustration } from '@components/index';
import { Permissions } from '@constants/index';
import { fetchLocationData } from '@redux/actions/data/location';
import getNavigatorStyles from '@styles/NavStyles';
import getStyles from '@styles/Styles';
import { Account, LocationList, State } from '@ts/types';
import { useTheme, logger, Format, checkPermission } from '@utils/index';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';

type MoreListProps = {
  navigation: HomeTwoScreenNavigationProp<'List'>;
  location: LocationList;
  account: Account;
};

const MoreList: React.FC<MoreListProps> = ({ navigation, location, account }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigatorStyles = getNavigatorStyles(theme);
  const { colors } = theme;

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={[navigatorStyles.profileBackground, { paddingTop: insets.top }]}>
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
            {account.loggedIn ? (
              <View style={{ flexDirection: 'row' }}>
                <View style={{ marginRight: 10 }}>
                  <Avatar
                    avatar={account.accountInfo?.user?.info.avatar}
                    size={60}
                    style={navigatorStyles.avatar}
                  />
                </View>
                <View style={{ marginTop: -10 }}>
                  <Title style={navigatorStyles.title} numberOfLines={1}>
                    {Format.fullUserName(account.accountInfo.user)}
                  </Title>
                  <Subheading
                    style={[navigatorStyles.subtitle, { flex: 1 }]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    @{account.accountInfo.user.info.username}
                  </Subheading>
                </View>
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
