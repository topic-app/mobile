import React from 'react';
import { List, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { View, Appearance } from 'react-native';
import { connect } from 'react-redux';

import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import getSettingsStyles from '../styles/Styles';

function SettingsList({ navigation, preferences, account }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);

  return (
    <View style={styles.page}>
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
          title="Changer de lieu"
          right={() => <List.Icon icon="chevron-right" />}
          description="Écoles, départements, régions"
          left={() => <List.Icon icon="map-marker-outline" />}
          onPress={() => navigation.navigate('Landing', { screen: 'SelectLocation' })}
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
            description="Visibilité du compte, addresse email, suppression"
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
}

const mapStateToProps = (state) => {
  const { preferences, account } = state;
  return { preferences, account };
};

SettingsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  preferences: PropTypes.shape({
    theme: PropTypes.string,
    useSystemTheme: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(SettingsList);
