import React from 'react';
import { View, FlatList, Platform } from 'react-native';
import { Text, List, RadioButton, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import getStyles from '../../../../styles/Styles';
import getSettingsStyles from '../styles/Styles';

import themes from '../../../../styles/Theme';

import { updatePrefs } from '../../../../redux/actions/prefs';

function SettingsTheme({ preferences, theme }) {
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const { colors } = theme;

  return (
    <View style={styles.page}>
      <FlatList
        data={Object.values(themes)}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            left={() =>
              Platform.OS !== 'ios' && (
                <RadioButton
                  color={colors.primary}
                  status={item.value === preferences.theme ? 'checked' : 'unchecked'}
                  onPress={() => updatePrefs({ theme: item.value })}
                />
              )
            }
            right={() =>
              Platform.OS === 'ios' && (
                <RadioButton
                  color={colors.primary}
                  status={item.value === preferences.theme ? 'checked' : 'unchecked'}
                  onPress={() => updatePrefs({ theme: item.value })}
                />
              )
            }
            onPress={() => updatePrefs({ theme: item.value })}
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
