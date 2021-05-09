import React from 'react';
import { List, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { PageContainer } from '@components';
import { Account, Preferences, State } from '@ts/types';

import type { SettingsScreenNavigationProp } from '.';
import getStyles from './styles';

type SettingsListProps = {
  preferences: Preferences;
  account: Account;
  navigation: SettingsScreenNavigationProp<'List'>;
};

const SettingsList: React.FC<SettingsListProps> = ({ navigation, account }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <PageContainer headerOptions={{ title: 'Paramètres' }} centered scroll>
      <List.Section>
        <List.Item
          title="Apparence"
          description="Thème, taille du texte, accessibilité"
          right={() => <List.Icon icon="chevron-right" />}
          left={() => <List.Icon icon="brightness-6" />}
          onPress={() => navigation.navigate('Appearance')}
          style={styles.listItem}
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
          style={styles.listItem}
        />
        <List.Item
          title="Vie privée"
          description="Historique, recommendations"
          right={() => <List.Icon icon="chevron-right" />}
          left={() => <List.Icon icon="eye-outline" />}
          onPress={() => navigation.navigate('Privacy')}
          style={styles.listItem}
        />
        {account.loggedIn && (
          <List.Item
            title="Compte et profil"
            description="Visibilité du compte, adresse email, suppression"
            left={() => <List.Icon icon="account" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'More',
                params: { screen: 'Profile', params: { screen: 'Profile' } },
              })
            }
          />
        )}
        <List.Item
          title="Avancé"
          description="Informations, mode développeur"
          right={() => <List.Icon icon="chevron-right" />}
          left={() => <List.Icon icon="wrench" />}
          onPress={() => navigation.navigate('Dev')}
          style={styles.listItem}
        />
      </List.Section>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(SettingsList);
