import React from 'react';
import { View, Appearance } from 'react-native';
import { List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { Account, Preferences, State } from '@ts/types';
import { CustomHeaderBar } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';

import getSettingsStyles from '../styles/Styles';
import type { SettingsStackParams } from '../index';

type SettingsListProps = {
  preferences: Preferences;
  account: Account;
  navigation: StackNavigationProp<SettingsStackParams, 'Content'>;
};

const SettingsList: React.FC<SettingsListProps> = ({ navigation, preferences, account }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);

  return (
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Paramètres',
            },
          },
        }}
      />
      <List.Section>
        <List.Item
          title="Theme"
          right={() => <List.Icon icon="chevron-right" />}
          description={
            preferences.useSystemTheme
              ? `${Appearance.getColorScheme() === 'dark' ? 'Sombre' : 'Clair'} (système)`
              : themes[preferences.theme]?.name
          }
          left={() => <List.Icon icon="brightness-6" />}
          onPress={() => navigation.navigate('Theme')}
          style={settingsStyles.listItem}
        />
        <List.Item
          title="Contenu"
          description="Taille du texte, accessibilité"
          right={() => <List.Icon icon="chevron-right" />}
          left={() => <List.Icon icon="format-letter-case" />}
          onPress={() => navigation.navigate('Content')}
          style={settingsStyles.listItem}
        />
        <List.Item
          title="Changer de lieu"
          right={() => <List.Icon icon="chevron-right" />}
          description="Écoles, départements, régions"
          left={() => <List.Icon icon="map-marker-outline" />}
          onPress={() =>
            navigation.navigate('Landing', {
              screen: 'SelectLocation',
              params: { goBack: true },
            })
          }
          style={settingsStyles.listItem}
        />
        <List.Item
          title="Vie privée"
          description="Historique, recommendations"
          right={() => <List.Icon icon="chevron-right" />}
          left={() => <List.Icon icon="eye-outline" />}
          onPress={() => navigation.navigate('Privacy')}
          style={settingsStyles.listItem}
        />
        {account.loggedIn && (
          <List.Item
            title="Profil"
            description="Visibilité du compte, adresse email, suppression"
            left={() => <List.Icon icon="account" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={settingsStyles.listItem}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'More',
                params: { screen: 'Profile', params: { screen: 'Profile' } },
              })
            }
          />
        )}
      </List.Section>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences, account } = state;
  return { preferences, account };
};

export default connect(mapStateToProps)(SettingsList);
