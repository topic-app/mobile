import React from 'react';
import { View, FlatList, Platform, Appearance } from 'react-native';
import { List, RadioButton, Divider, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Illustration } from '@components/index';
import { updatePrefs } from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';

import getSettingsStyles from '../styles/Styles';

function SettingsTheme({ preferences, theme }) {
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const { colors } = theme;

  return (
    <View style={styles.page}>
      <FlatList
        data={Object.values(themes)}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="settings-theme" height={200} width={200} />
            </View>
            <Divider style={{ marginTop: 30 }} />
            <List.Item
              title={`Utiliser le thème du système (${
                Appearance.getColorScheme() === 'dark' ? 'Sombre' : 'Clair'
              })`}
              left={() =>
                Platform.OS !== 'ios' && (
                  <RadioButton
                    color={colors.primary}
                    status={preferences.useSystemTheme ? 'checked' : 'unchecked'}
                    onPress={() => updatePrefs({ useSystemTheme: true })}
                  />
                )
              }
              right={() =>
                Platform.OS === 'ios' && (
                  <RadioButton
                    color={colors.primary}
                    status={preferences.useSystemTheme ? 'checked' : 'unchecked'}
                    onPress={() => updatePrefs({ useSystemTheme: true })}
                  />
                )
              }
              onPress={() => updatePrefs({ useSystemTheme: true })}
              style={settingsStyles.listItem}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            left={() =>
              Platform.OS !== 'ios' && (
                <RadioButton
                  color={colors.primary}
                  status={
                    item.value === preferences.theme && !preferences.useSystemTheme
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => updatePrefs({ theme: item.value, useSystemTheme: false })}
                />
              )
            }
            right={() =>
              Platform.OS === 'ios' && (
                <RadioButton
                  color={colors.primary}
                  status={
                    item.value === preferences.theme && !preferences.useSystemTheme
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => updatePrefs({ theme: item.value, useSystemTheme: false })}
                />
              )
            }
            onPress={() => updatePrefs({ theme: item.value, useSystemTheme: false })}
            style={settingsStyles.listItem}
          />
        )}
        keyExtractor={(item) => item.value}
      />
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
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(withTheme(SettingsTheme));
