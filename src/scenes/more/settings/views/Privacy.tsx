import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { List, Avatar, Divider, Banner, Switch, withTheme } from 'react-native-paper';
import { clearArticlesRead } from '@redux/actions/contentData/articles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Illustration } from '@components/index';
import { updatePrefs } from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';

import getSettingsStyles from '../styles/Styles';

function SettingsTheme({ preferences, theme, account, navigation }) {
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const { colors } = theme;

  const toggleHistory = () => {
    if (!preferences.history) {
      updatePrefs({
        history: true,
      });
    } else {
      Alert.alert(
        "Voulez vous vraiment désactiver l'historique ?",
        "L'historique actuel et les centres d'interet seront aussi supprimés. Vous n'aurez plus de recommendations.",
        [
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Désactiver',
            onPress: () => {
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

  const toggleRecommendations = () => {
    if (!preferences.recommendations) {
      updatePrefs({
        recommendations: true,
      });
    } else {
      Alert.alert(
        'Voulez vous vraiment désactiver les recommendations ?',
        "Les centres d'interet actuels seront aussi supprimés.",
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
                recommendations: false,
              });
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  const toggleSyncHistory = () => {
    if (!preferences.syncHistory) {
      updatePrefs({
        syncHistory: true,
      });
    } else {
      Alert.alert(
        "Voulez vous vraiment désactiver la synchronisation de l'historique ?",
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

  const toggleSyncLists = () => {
    if (!preferences.syncLists) {
      updatePrefs({
        syncLists: true,
      });
    } else {
      Alert.alert(
        'Voulez vous vraiment désactiver la synchronisation des listes de contenu ?',
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
                onTouchEnd={toggleHistory}
              />
            )}
            onPress={toggleHistory}
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
                onTouchEnd={toggleRecommendations}
              />
            )}
            onPress={toggleRecommendations}
            style={settingsStyles.listItem}
          />
        </List.Section>
        <Divider />
        {account.loggedIn && (
          <View>
            <Banner
              visible
              actions={[
                {
                  label: 'En savoir plus',
                  onPress: () => {
                    console.log('Read more');
                  },
                },
              ]}
              icon={({ size }) => (
                <Avatar.Icon
                  style={{ backgroundColor: colors.primary }}
                  size={size}
                  icon="shield-lock-outline"
                />
              )}
            >
              Si vous choissisez de synchroniser l'historique, les centres d'interêt ou les listes
              sur le serveur, ces informations seront chiffrées avec l'aide de votre mot de passe et
              nous n'y aurons pas accès.
            </Banner>
          </View>
        )}
        <List.Section>
          <List.Item
            title="Synchroniser l'historique et les centres d'interet"
            description={
              account.loggedIn
                ? preferences.history
                  ? "Associer l'historique et les recommendations avec votre compte, et synchroniser entre vos appareils"
                  : "Activez l'historique pour synchroniser"
                : "Connectez vous pour synchroniser l'historique avec votre compte"
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
                onPress={toggleSyncHistory}
              />
            )}
            onPress={toggleSyncHistory}
            style={settingsStyles.listItem}
          />
          <List.Item
            title="Synchroniser les listes de contenu"
            description={
              account.loggedIn
                ? "Associer les listes (favoris, pour plus tard...) à votre compte afin de pouvoir y accéder à partir d'autres appareils"
                : 'Connectez vous pour synchroniser les listes avec votre compte'
            }
            disabled={!account.loggedIn}
            titleStyle={account.loggedIn ? {} : { color: colors.disabled }}
            descriptionStyle={account.loggedIn ? {} : { color: colors.disabled }}
            right={() => (
              <Switch
                color={colors.primary}
                disabled={!account.loggedIn}
                value={account.loggedIn && preferences.syncLists}
                onPress={toggleSyncLists}
              />
            )}
            onPress={toggleSyncLists}
            style={settingsStyles.listItem}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Item
            title="Voir l'historique et les centres d'interet"
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
                "Voulez vous vraiment supprimer l'intégralité de l'historique ?",
                'Cette action est irréversible',
                [
                  {
                    text: 'Annuler',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'Supprimer',
                    onPress: clearArticlesRead,
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
            title="Supprimer les centres d'interet"
            disabled={!preferences.recommendations}
            titleStyle={preferences.recommendations ? {} : { color: colors.disabled }}
            descriptionStyle={preferences.recommendations ? {} : { color: colors.disabled }}
            onPress={() =>
              Alert.alert(
                "Voulez vous vraiment supprimer tous les centres d'interet ?",
                'Cette action est irréversible NON IMPLEMENTÉ',
                [
                  {
                    text: 'Annuler',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  /* {
                    text: 'Supprimer',
                    onPress: () => console.log('Delete interests'),
                  }, j */
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
}

SettingsTheme.propTypes = {
  preferences: PropTypes.shape({
    theme: PropTypes.string.isRequired,
    useSystemTheme: PropTypes.bool.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { preferences, account } = state;
  return { preferences, account };
};

export default connect(mapStateToProps)(withTheme(SettingsTheme));
