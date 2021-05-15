import React from 'react';
import { View, BackHandler, Platform, Clipboard, Linking } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  Illustration,
  PageContainer,
  Setting,
  SettingSection,
  SettingToggle,
  SettingTooltip,
} from '@components';
import { updatePrefs } from '@redux/actions/data/prefs';
import Store from '@redux/store';
import { Preferences, State, AccountState, FULL_CLEAR } from '@ts/types';
import { Alert, crashlytics, messaging } from '@utils';

import type { SettingsScreenNavigationProp } from '.';
import getStyles from './styles';

type SettingsDevProps = {
  preferences: Preferences;
  account: AccountState;
  navigation: SettingsScreenNavigationProp<'Privacy'>;
};

const SettingsDev: React.FC<SettingsDevProps> = ({ preferences, navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const toggleDevServer = () => {
    Alert.alert(
      'Voulez-vous vraiment changer de serveur ?',
      "Les données de l'application seront supprimées, étant donné que les deux serveurs sont incompatibles.",
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Changer',
          onPress: () => {
            Alert.alert('Effacage des données', '', [], { cancelable: false });
            updatePrefs({
              useDevServer: !preferences.useDevServer,
            });
            Store.dispatch({ type: FULL_CLEAR, data: {} });
            setTimeout(BackHandler.exitApp, 1000); // Because React native bug
          },
        },
      ],
      { cancelable: true },
    );
  };

  const toggleAdvancedMode = () =>
    preferences.advancedMode
      ? updatePrefs({ advancedMode: false })
      : Alert.alert(
          'Voulez vous vraiment activer le mode avancé ?',
          "Cette option donne accès à des informations sensibles sur votre compte et votre appareil, et peut réduire la sécurité de votre compte et la stabilité de l'application. Activez le mode avancé uniquement si vous savez ce que vous faites.",
          [
            {
              text: 'Annuler',
              style: 'cancel',
            },
            {
              text: 'Activer',
              onPress: () => updatePrefs({ advancedMode: true }),
            },
          ],
          { cancelable: true },
        );

  return (
    <PageContainer
      headerOptions={{ title: 'Développement', subtitle: 'Paramètres' }}
      centered
      scroll
    >
      <Illustration centered name="beta-bugs" />
      <SettingSection title="Informations">
        <List.Item
          title="Feedback"
          description={`Utilisez l'élément "Feedback" depuis ${
            Platform.OS === 'ios' ? 'la section Plus' : 'le menu'
          } pour donner votre avis sur l'application ou signaler un bug`}
          left={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <List.Icon
                color={colors.background}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                }}
                icon="bug"
              />
            </View>
          )}
          descriptionNumberOfLines={3}
        />
        <List.Item
          title="Canal Telegram"
          description="Recevez les dernières infos et discutez avec l'équipe Topic App et les autres utilisateurs"
          left={() => (
            <View
              style={{
                margin: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Illustration name="telegram" height={40} width={40} />
            </View>
          )}
          right={() => <List.Icon icon="open-in-new" color={colors.subtext} />}
          descriptionNumberOfLines={3}
          onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfRz29dT2eYy9w_7A')}
        />
        <List.Item
          title="Bêta"
          description="Visitez beta.topicapp.fr pour télécharger la bêta et avoir accès aux nouvelles fonctionnalités avant les autres utilisateurs"
          left={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <List.Icon
                color={colors.background}
                style={{
                  backgroundColor: colors.disabled,
                  borderRadius: 20,
                }}
                icon="flask"
              />
            </View>
          )}
          onPress={() => Linking.openURL('https://beta.topicapp.fr')}
          descriptionNumberOfLines={3}
        />
        <List.Item
          title="Plantages"
          description="Certains rapports de plantage sont envoyés automatiquement, mais nous vous conseillons de les signaler"
          left={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <List.Icon
                color={colors.background}
                style={{
                  backgroundColor: colors.disabled,
                  borderRadius: 20,
                }}
                icon="pulse"
              />
            </View>
          )}
          descriptionNumberOfLines={3}
        />
        <List.Item
          title="Statistiques"
          description="Topic envoie automatiquement des informations anonymes sur votre interaction avec l'application. Vous pouvez désactiver l'envoi depuis les paramètres"
          left={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <List.Icon
                color={colors.background}
                style={{
                  backgroundColor: colors.disabled,
                  borderRadius: 20,
                }}
                icon="chart-timeline-variant"
              />
            </View>
          )}
          descriptionNumberOfLines={3}
        />
        <List.Item
          title="Mises à jour"
          description="Nous publions des mises à jour toutes les semaines environ. Vous pouvez regarder les notes de mise à jour pour voir les fonctionnalités à tester"
          left={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <List.Icon
                color={colors.background}
                style={{
                  backgroundColor: colors.disabled,
                  borderRadius: 20,
                }}
                icon="update"
              />
            </View>
          )}
          descriptionNumberOfLines={3}
        />
      </SettingSection>
      <SettingSection title="Développeurs" bottomDivider>
        <SettingToggle
          title="Mode développeur"
          description="Options utiles pour le déboguage et le développement"
          value={preferences.advancedMode}
          onPress={toggleAdvancedMode}
        />
        {preferences.advancedMode && (
          <>
            <SettingToggle
              title="Utiliser le serveur de développement"
              description="Publiez des articles et des évènements de test, cette option efface les données et redémarre l'application"
              value={preferences.useDevServer}
              onPress={toggleDevServer}
            />
            <SettingTooltip
              icon="alert-circle-outline"
              tooltip={
                'Vérifiez que la bannière "Serveur de développement" est affichée avant de publier un contenu de test'
              }
            />
            <Setting
              title="Montrer l'écran de bienvenue"
              description="Cette option n'efface aucune donnée"
              onPress={() => navigation.push('Landing', { screen: 'Welcome' })}
            />
            <Setting
              title="Forcer un plantage du thread JavaScript"
              description="Lance une erreur JS"
              onPress={() => {
                throw new Error('[DEBUG] Testing crash');
              }}
            />
            {Platform.OS !== 'web' && (
              <Setting
                title="Forcer un plantage natif"
                description="Cause un plantage via crashlytics"
                onPress={() => {
                  crashlytics!().crash();
                }}
              />
            )}
          </>
        )}
      </SettingSection>
      {preferences.advancedMode && (
        <>
          <SettingSection title="Données" bottomDivider>
            <List.Item
              title="Copier l'entièreté de la base de données locale"
              description="Inclut des données sensibles"
              onPress={() => {
                Clipboard.setString(JSON.stringify(Store.getState(), null, 2));
              }}
            />
            <List.Item
              title="Copier la base de données permanente locale"
              description="Inclut des données sensibles"
              onPress={() => {
                Clipboard.setString(
                  JSON.stringify(
                    {
                      preferences: Store.getState().preferences,
                      account: Store.getState().account,
                      location: Store.getState().location,
                      articleData: Store.getState().articleData,
                      eventData: Store.getState().eventData,
                      groupData: Store.getState().groupData,
                    },
                    null,
                    2,
                  ),
                );
              }}
            />
            <List.Item
              title="Copier les informations sur le compte"
              description="Inclut des données sensibles"
              onPress={() => {
                Clipboard.setString(JSON.stringify(Store.getState().account, null, 2));
              }}
            />
            <List.Item
              title="Copier les informations sur la localisation"
              onPress={() => {
                Clipboard.setString(JSON.stringify(Store.getState().location, null, 2));
              }}
            />
            <List.Item
              title="Copier les paramètres locaux"
              onPress={() => {
                Clipboard.setString(JSON.stringify(Store.getState().preferences, null, 2));
              }}
            />
            <List.Item
              title="Copier la base de données permanente des contenus"
              onPress={() => {
                Clipboard.setString(
                  JSON.stringify(
                    {
                      articleData: Store.getState().articleData,
                      eventData: Store.getState().eventData,
                      groupData: Store.getState().groupData,
                    },
                    null,
                    2,
                  ),
                );
              }}
            />
            <List.Item
              title="Copier la base de données temporaire des contenus"
              onPress={() => {
                Clipboard.setString(
                  JSON.stringify(
                    {
                      articles: Store.getState().articles,
                      events: Store.getState().events,
                      groups: Store.getState().groups,
                      users: Store.getState().users,
                      comments: Store.getState().comments,
                      schools: Store.getState().schools,
                      departments: Store.getState().departments,
                      tags: Store.getState().tags,
                      legal: Store.getState().legal,
                      linking: Store.getState().linking,
                      places: Store.getState().places,
                      upload: Store.getState().upload,
                    },
                    null,
                    2,
                  ),
                );
              }}
            />
            {Platform.OS !== 'web' && (
              <List.Item
                title="Copier le jeton FCM"
                onPress={async () => {
                  Clipboard.setString(await messaging!().getToken());
                }}
              />
            )}
          </SettingSection>
          <SettingSection title="Navigation" bottomDivider>
            <List.Item
              title="Ouvrir topic:///legal?page=conditions"
              onPress={async () => {
                Linking.openURL('topic:///legal?page=conditions');
              }}
            />
            <List.Item
              title="Ouvrir https://www.topicapp.fr/legal?page=conditions"
              onPress={async () => {
                Linking.openURL('https://www.topicapp.fr/legal?page=conditions');
              }}
            />
            <List.Item
              title="Ouvrir topic:///nonexistent"
              onPress={async () => {
                Linking.openURL('topic:///nonexistent');
              }}
            />
            <List.Item
              title="Naviguer vers une page non existente"
              onPress={async () => {
                navigation.navigate('NonExistentScreen');
              }}
            />
          </SettingSection>
        </>
      )}
      <View style={styles.container}>
        <Text style={{ color: colors.disabled }}>
          Version de la base de données : {preferences.reduxVersion}
        </Text>
      </View>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(SettingsDev);
