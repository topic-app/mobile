import React from 'react';
import { View, ScrollView } from 'react-native';
import { List, Avatar, Divider, Switch } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration, CustomHeaderBar, Banner } from '@components/index';
import { clearArticlesRead } from '@redux/actions/contentData/articles';
import { updatePrefs } from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import { Preferences, State, AccountState } from '@ts/types';
import { useTheme, Alert, trackEvent } from '@utils/index';

import type { SettingsScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';

type SettingsPrivacyProps = {
  preferences: Preferences;
  account: AccountState;
  navigation: SettingsScreenNavigationProp<'Privacy'>;
};

const SettingsPrivacy: React.FC<SettingsPrivacyProps> = ({ preferences, account, navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const { colors } = theme;

  const toggleHistory = (val: boolean) => {
    if (val) {
      trackEvent('prefs:updateHistory', { props: { value: 'yes' } });
      updatePrefs({
        history: true,
      });
    } else {
      Alert.alert(
        "Voulez-vous vraiment désactiver l'historique ?",
        "L'historique actuel et les centres d'intérêt seront aussi supprimés. Vous n'aurez plus de recommendations.",
        [
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Désactiver',
            onPress: () => {
              trackEvent('prefs:updateHistory', { props: { value: 'no' } });
              clearArticlesRead();
              updatePrefs({
                history: false,
                recommendations: false,
                syncHistory: false,
              });
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  const toggleRecommendations = (val: boolean) => {
    if (val) {
      trackEvent('prefs:updateRecommendations', { props: { value: 'yes' } });
      updatePrefs({
        recommendations: true,
      });
    } else {
      Alert.alert(
        'Voulez-vous vraiment désactiver les recommendations ?',
        "Les centres d'intérêt actuels seront aussi supprimés.",
        [
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Désactiver',
            onPress: () => {
              trackEvent('prefs:updateRecommendations', { props: { value: 'no' } });
              updatePrefs({
                recommendations: false,
              });
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  const toggleSyncHistory = (val: boolean) => {
    if (val) {
      updatePrefs({
        syncHistory: true,
      });
    } else {
      Alert.alert(
        "Voulez-vous vraiment désactiver la synchronisation de l'historique ?",
        'Les données sur le serveur seront supprimées',
        [
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Désactiver',
            onPress: () => {
              updatePrefs({
                syncHistory: false,
              });
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  const toggleSyncLists = (val: boolean) => {
    if (val) {
      updatePrefs({
        syncLists: true,
      });
    } else {
      Alert.alert(
        'Voulez-vous vraiment désactiver la synchronisation des listes de contenu ?',
        'Les données sur le serveur seront supprimées',
        [
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Désactiver',
            onPress: () => {
              updatePrefs({
                syncLists: false,
              });
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  return (
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Vie privée',
              subtitle: 'Paramètres',
            },
          },
        }}
      />
      <ScrollView>
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="settings-privacy" height={200} width={200} />
        </View>
        <List.Section>
          <List.Subheader>Historique</List.Subheader>
          <Divider />
          <List.Item
            title="Enregistrer l'historique"
            description="Garder un historique des contenus visités"
            right={() => (
              <Switch
                value={preferences.history}
                color={colors.primary}
                onValueChange={toggleHistory}
              />
            )}
            onPress={() => toggleHistory(!preferences.history)}
            style={settingsStyles.listItem}
          />
          <List.Item
            title="Recommender des contenus"
            disabled
            titleStyle={{ color: colors.disabled }}
            descriptionStyle={{ color: colors.disabled }}
            description={
              preferences.history
                ? "Indisponible dans cette version de l'application"
                : "Activez l'historique pour enregistrer des recommendations"
            }
            right={() => (
              <Switch
                disabled
                color={colors.primary}
                value={preferences.recommendations}
                onValueChange={toggleRecommendations}
              />
            )}
            onPress={() => toggleRecommendations(!preferences.recommendations)}
            style={settingsStyles.listItem}
          />
        </List.Section>
        <Divider />
        {/* {account.loggedIn && (
          <View>
            <Banner
              visible
              actions={[]}
              icon={({ size }) => (
                <Avatar.Icon
                  style={{ backgroundColor: colors.primary }}
                  size={size}
                  icon="shield-lock-outline"
                />
              )}
            >
              Si vous choisissez de synchroniser l&apos;historique, les centres d&apos;intérêt ou
              les listes sur le serveur, ces informations seront chiffrées avec l&apos;aide de votre
              mot de passe et nous n&apos;y aurons pas accès.
            </Banner>
          </View>
        )}
        <List.Section>
          <List.Item
            title="Synchroniser l'historique et les centres d'intérêt"
            description={
              account.loggedIn
                ? preferences.history
                  ? "Associer l'historique et les recommendations avec votre compte et synchroniser entre vos appareils"
                  : "Activez l'historique pour synchroniser"
                : "Connectez-vous pour synchroniser l'historique avec votre compte"
            }
            disabled={!account.loggedIn || !preferences.history}
            titleStyle={account.loggedIn && preferences.history ? {} : { color: colors.disabled }}
            descriptionStyle={
              account.loggedIn && preferences.history ? {} : { color: colors.disabled }
            }
            right={() => (
              <Switch
                color={colors.primary}
                disabled={!account.loggedIn || !preferences.history}
                value={account.loggedIn && preferences.syncHistory}
                onValueChange={toggleSyncHistory}
              />
            )}
            onPress={() => toggleSyncHistory(!preferences.syncHistory)}
            style={settingsStyles.listItem}
          />
          <List.Item
            title="Synchroniser les listes de contenu"
            description={
              account.loggedIn
                ? "Associer les listes (favoris, pour plus tard, ...) à votre compte afin de pouvoir y accéder à partir d'autres appareils"
                : 'Connectez-vous pour synchroniser les listes avec votre compte'
            }
            disabled={!account.loggedIn}
            titleStyle={account.loggedIn ? {} : { color: colors.disabled }}
            descriptionStyle={account.loggedIn ? {} : { color: colors.disabled }}
            right={() => (
              <Switch
                color={colors.primary}
                disabled={!account.loggedIn}
                value={account.loggedIn && preferences.syncLists}
                onValueChange={toggleSyncLists}
              />
            )}
            onPress={() => toggleSyncLists(!preferences.syncLists)}
            style={settingsStyles.listItem}
          />
        </List.Section>
        <Divider /> */}
        <List.Section>
          <List.Item
            title="Voir l'historique et les centres d'intérêt"
            right={() => (
              <List.Icon
                style={{ height: 15 }}
                icon="chevron-right"
                color={preferences.history ? colors.text : colors.disabled}
              />
            )}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'History',
                params: {
                  screen: 'Main',
                },
              })
            }
            disabled={!preferences.history}
            titleStyle={preferences.history ? {} : { color: colors.disabled }}
            descriptionStyle={preferences.history ? {} : { color: colors.disabled }}
            style={settingsStyles.listItem}
          />
          <List.Item
            title="Supprimer l'historique"
            onPress={() =>
              Alert.alert(
                "Voulez-vous vraiment supprimer l'intégralité de l'historique ?",
                'Cette action est irréversible',
                [
                  {
                    text: 'Annuler',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'Supprimer',
                    onPress: () => {
                      trackEvent('prefs:clearHistory');
                      clearArticlesRead();
                    },
                  },
                ],
                { cancelable: true },
              )
            }
            disabled={!preferences.history}
            titleStyle={preferences.history ? {} : { color: colors.disabled }}
            descriptionStyle={preferences.history ? {} : { color: colors.disabled }}
            style={settingsStyles.listItem}
          />
          <List.Item
            title="Supprimer les centres d'intérêt"
            disabled={!preferences.recommendations}
            titleStyle={preferences.recommendations ? {} : { color: colors.disabled }}
            descriptionStyle={preferences.recommendations ? {} : { color: colors.disabled }}
            onPress={() =>
              Alert.alert(
                "Voulez-vous vraiment supprimer tous les centres d'intérêt ?",
                'Cette action est irréversible (non implémenté)',
                [
                  {
                    text: 'Annuler',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  /* {
                    text: 'Supprimer',
                    onPress: () =>   trackEvent('prefs:deleteRecommendations'); console.log('Delete interests'),
                  }, */
                ],
                { cancelable: true },
              )
            }
            style={settingsStyles.listItem}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences, account } = state;
  return { preferences, account };
};

export default connect(mapStateToProps)(SettingsPrivacy);
