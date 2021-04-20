import React from 'react';
import { View, BackHandler, Platform, Clipboard } from 'react-native';
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

  const [crashlyticsEnabled, setCrashlyticsEnabled] = React.useState(
    Platform.OS !== 'web' ? crashlytics!().isCrashlyticsCollectionEnabled : false,
  );

  function toggleCrashlytics(val = !crashlyticsEnabled) {
    crashlytics?.()
      .setCrashlyticsCollectionEnabled(val)
      .then(() => setCrashlyticsEnabled(val));
  }

  return (
    <PageContainer headerOptions={{ title: 'Bêta', subtitle: 'Paramètres' }} centered scroll>
      <Illustration centered name="beta-bugs" />
      <SettingSection title="Données Analytiques" bottomDivider>
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
            {Platform.OS === 'web' && (
              <List.Item
                title="Copier le jeton FCM"
                onPress={async () => {
                  Clipboard.setString(await messaging!().getToken());
                }}
              />
            )}
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
