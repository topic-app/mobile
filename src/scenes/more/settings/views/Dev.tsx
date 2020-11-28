import React from 'react';
import { View, ScrollView, Alert, BackHandler } from 'react-native';
import { List, Avatar, Divider, Banner, Switch } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration, CustomHeaderBar } from '@components/index';
import { firebase } from '@utils/firebase';
import { updatePrefs } from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import { Preferences, State, AccountState, FULL_CLEAR } from '@ts/types';
import { useTheme } from '@utils/index';

import Store from '@redux/store';
import type { SettingsScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';

type SettingsDevProps = {
  preferences: Preferences;
  account: AccountState;
  navigation: SettingsScreenNavigationProp<'Privacy'>;
};

const SettingsDev: React.FC<SettingsDevProps> = ({ preferences, account, navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const { colors } = theme;

  const toggleDevServer = () => {
    Alert.alert(
      'Voulez vous vraiment changer de serveur ?',
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

  const toggleAnalytics = async (state: boolean) => {
    await firebase.analytics().setAnalyticsCollectionEnabled(state);
  };

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
      <ScrollView>
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="beta-bugs" height={200} width={200} />
        </View>
        <List.Section>
          <List.Subheader>Données Analytiques</List.Subheader>
          <Divider />
          <List.Item
            title="Désactiver l'envoi des données analytiques"
            description="Envoie des informations sur vos actions dans l'application et des informations sur l'appareil"
            onPress={() => toggleAnalytics(false)}
            style={settingsStyles.listItem}
          />
          <List.Item
            title="Activer l'envoi des données analytiques"
            description="Envoie des informations sur vos actions dans l'application et des informations sur l'appareil"
            onPress={() => toggleAnalytics(true)}
            style={settingsStyles.listItem}
          />
        </List.Section>
        <Divider />
        <View>
          <Banner
            visible
            actions={[]}
            icon={({ size }) => (
              <Avatar.Icon style={{ backgroundColor: colors.primary }} size={size} icon="wrench" />
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
                onTouchEnd={toggleDevServer}
              />
            )}
            onPress={toggleDevServer}
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

export default connect(mapStateToProps)(SettingsDev);
