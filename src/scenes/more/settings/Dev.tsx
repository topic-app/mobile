import React from 'react';
import { View, ScrollView, BackHandler, Platform, Clipboard } from 'react-native';
import { List, Avatar, Divider, Switch, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration, CustomHeaderBar, Banner } from '@components';
import { updatePrefs } from '@redux/actions/data/prefs';
import Store from '@redux/store';
import { Preferences, State, AccountState, FULL_CLEAR } from '@ts/types';
import { Alert } from '@utils';
import { crashlytics } from '@utils/firebase';

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
    Platform.OS !== 'web' ? crashlytics().isCrashlyticsCollectionEnabled : false,
  );

  function toggleCrashlytics(val = !crashlyticsEnabled) {
    crashlytics()
      .setCrashlyticsCollectionEnabled(val)
      .then(() => setCrashlyticsEnabled(val));
  }

  return (
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Bêta',
              subtitle: 'Paramètres',
            },
          },
        }}
      />
      <View style={styles.centeredPage}>
        <ScrollView>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="beta-bugs" height={200} width={200} />
          </View>
          <List.Section>
            <List.Subheader>Données Analytiques</List.Subheader>
            <Divider />
            <List.Item
              title="Envoyer des données analytiques anonymes"
              description="Envoie des informations sur vos actions dans l'application et des informations sur l'appareil, pour nous aider à résoudre des bugs et améliorer l'application. Ces données sont anonymisées et ne contienent pas d'informations sur l'historique de lecture ou sur votre compte."
              onPress={() => updatePrefs({ analytics: !preferences.analytics })}
              right={() => (
                <Switch
                  color={colors.primary}
                  value={preferences.analytics}
                  onValueChange={(data) => updatePrefs({ analytics: data })}
                />
              )}
              descriptionNumberOfLines={10}
              style={styles.listItem}
            />
            {Platform.OS !== 'web' && (
              <List.Item
                title="Envoyer des rapports de plantage"
                description="Envoie des informations sur les plantages afin de nous aider à les résoudre"
                onPress={() => toggleCrashlytics()}
                right={() => (
                  <Switch
                    color={colors.primary}
                    value={crashlyticsEnabled}
                    onValueChange={toggleCrashlytics}
                  />
                )}
                descriptionNumberOfLines={10}
                style={styles.listItem}
              />
            )}
          </List.Section>
          <Divider style={{ marginTop: 50 }} />
          <List.Section>
            <List.Item
              title="Mode développeur"
              description="Options utiles pour le déboguage et le développement"
              right={() => (
                <Switch
                  color={colors.primary}
                  value={preferences.advancedMode}
                  onValueChange={toggleAdvancedMode}
                />
              )}
              onPress={toggleAdvancedMode}
              style={styles.listItem}
            />
          </List.Section>
          {preferences.advancedMode && (
            <View>
              <Divider />
              <View>
                <Banner
                  visible
                  actions={[]}
                  icon={({ size }) => (
                    <Avatar.Icon
                      style={{ backgroundColor: colors.primary }}
                      size={size}
                      icon="wrench"
                    />
                  )}
                >
                  {`Si vous utilisez le serveur de développement, vous pourrez publier des articles et des évènements de test.${'\n'}Vérifiez bien que la bannière "Serveur de développement" est affichée avant de publier un contenu de test.${'\n'}Utiliser le serveur de développement nécéssitera d'effacer les données de l'application et de redémarrer l'application.`}
                </Banner>
              </View>
              <List.Section>
                <List.Item
                  title="Utiliser le serveur de développement"
                  description="Pour pouvoir publier des contenus de test"
                  right={() => (
                    <Switch
                      color={colors.primary}
                      value={preferences.useDevServer}
                      onValueChange={toggleDevServer}
                    />
                  )}
                  onPress={toggleDevServer}
                  style={styles.listItem}
                />

                <List.Item
                  title="Montrer l'écran de bienvenue"
                  description="Cette option n'efface aucune donnée"
                  onPress={() => {
                    navigation.push('Landing', {
                      screen: 'Welcome',
                    });
                  }}
                />
              </List.Section>
              <Divider />
              <List.Section>
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
              </List.Section>
              <Divider />
              <List.Section>
                <List.Item
                  title="Forcer un plantage du thread JavaScript"
                  description="Lance une erreur JS"
                  onPress={() => {
                    throw new Error('[DEBUG] Testing crash');
                  }}
                />
                <List.Item
                  title="Forcer un plantage natif"
                  description="Cause un plantage via crashlytics"
                  onPress={() => {
                    crashlytics().crash();
                  }}
                />
              </List.Section>
            </View>
          )}
          <Divider />
          <View style={styles.container}>
            <Text style={{ color: colors.disabled }}>
              Version de la base de données : {preferences.reduxVersion}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(SettingsDev);
