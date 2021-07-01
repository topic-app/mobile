import React from 'react';
import { Platform } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration, PageContainer, Setting, SettingSection, SettingToggle } from '@components';
import { clearArticlesRead } from '@redux/actions/contentData/articles';
import { updatePrefs } from '@redux/actions/data/prefs';
import { Preferences, State } from '@ts/types';
import { Alert, crashlytics, trackEvent } from '@utils';

import type { SettingsScreenNavigationProp } from '.';

type SettingsPrivacyProps = {
  preferences: Preferences;
  navigation: SettingsScreenNavigationProp<'Privacy'>;
};

const SettingsPrivacy: React.FC<SettingsPrivacyProps> = ({ preferences, navigation }) => {
  const theme = useTheme();
  const { colors } = theme;

  const toggleHistory = () => {
    if (preferences.history) {
      Alert.alert(
        "Voulez-vous vraiment désactiver l'historique ?",
        "L'historique actuel et les centres d'intérêt seront aussi supprimés. Vous n'aurez plus de recommandations.",
        [
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Désactiver',
            onPress: () => {
              trackEvent('prefs:update-history', { props: { value: 'no' } });
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
    } else {
      trackEvent('prefs:update-history', { props: { value: 'yes' } });
      updatePrefs({
        history: true,
      });
    }
  };

  const toggleRecommendations = () => {
    if (preferences.recommendations) {
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
              trackEvent('prefs:update-recommendations', { props: { value: 'no' } });
              updatePrefs({
                recommendations: false,
              });
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      trackEvent('prefs:update-recommendations', { props: { value: 'yes' } });
      updatePrefs({
        recommendations: true,
      });
    }
  };

  const [crashlyticsEnabled, setCrashlyticsEnabled] = React.useState(
    Platform.OS !== 'web' ? crashlytics!().isCrashlyticsCollectionEnabled : false,
  );

  function toggleCrashlytics(val = !crashlyticsEnabled) {
    crashlytics?.()
      .setCrashlyticsCollectionEnabled(val)
      .then(() => setCrashlyticsEnabled(val));
  }

  return (
    <PageContainer headerOptions={{ title: 'Vie privée', subtitle: 'Paramètres' }} centered scroll>
      <Illustration name="settings-privacy" centered />
      <SettingSection title="Historique">
        <SettingToggle
          title="Enregistrer l'historique"
          description="Garder un historique des contenus visités"
          value={preferences.history}
          onPress={toggleHistory}
        />
        <SettingToggle
          disabled
          title="Recommender des contenus"
          description={
            preferences.history
              ? "Indisponible dans cette version de l'application"
              : "Activez l'historique pour avoir des recommandations"
          }
          value={preferences.recommendations}
          onPress={toggleRecommendations}
        />
        <Setting
          disabled={!preferences.history}
          title="Voir l'historique et les centres d'intérêt"
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'History',
              params: {
                screen: 'Main',
              },
            })
          }
          right={() => (
            <List.Icon
              icon="chevron-right"
              style={{ height: 18 }}
              color={preferences.history ? colors.text : colors.disabled}
            />
          )}
        />
        <Setting
          disabled={!preferences.history}
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
                    trackEvent('prefs:clear-history');
                    clearArticlesRead();
                  },
                },
              ],
              { cancelable: true },
            )
          }
        />
        {/* <Setting
          disabled={!preferences.recommendations}
          title="Supprimer les centres d'intérêt"
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
                {
                  text: 'Supprimer',
                  onPress: () =>   trackEvent('prefs:delete-recommendations'); console.log('Delete interests'),
                },
              ],
              { cancelable: true },
            )
          }
        /> */}
      </SettingSection>
      <SettingSection title="Données analytiques" bottomDivider>
        <SettingToggle
          title="Envoyer des données analytiques anonymes"
          description="Envoie des informations sur vos actions dans l'application et des informations sur l'appareil, pour nous aider à résoudre des bugs et améliorer l'application. Ces données sont anonymisées et ne contienent pas d'informations sur l'historique de lecture ou sur votre compte."
          onPress={() => updatePrefs({ analytics: !preferences.analytics })}
          value={preferences.analytics}
        />
        {Platform.OS !== 'web' && (
          <SettingToggle
            title="Envoyer des rapports de plantage"
            description="Envoie des informations sur les plantages afin de nous aider à les résoudre"
            value={crashlyticsEnabled}
            onPress={toggleCrashlytics}
            descriptionNumberOfLines={10}
          />
        )}
      </SettingSection>
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
                  ? "Associer l'historique et les recommandations avec votre compte et synchroniser entre vos appareils"
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
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(SettingsPrivacy);
