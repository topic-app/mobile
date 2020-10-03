import React from 'react';
import { View, FlatList, Platform, Appearance, TouchableWithoutFeedback } from 'react-native';
import { List, RadioButton, Divider, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { State } from '@ts/types';
import { Illustration } from '@components/index';
import { updatePrefs } from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';

import getSettingsStyles from '../styles/Styles';

type SettingsThemeProps = {
  preferences: {
    theme: string;
    useSystemTheme: boolean;
  };
};

const SettingsTheme: React.FC<SettingsThemeProps> = ({ preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const { colors } = theme;

  const [presses, setPresses] = React.useState(0);

  return (
    <View style={styles.page}>
      <FlatList
        data={
          preferences.themeEasterEggDiscovered
            ? Object.values(themes)
            : Object.values(themes).filter((t) => !t.egg)
        }
        ListHeaderComponent={() => (
          <View>
            <View style={styles.centerIllustrationContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (presses > 5) {
                    updatePrefs({ themeEasterEggDiscovered: true });
                  }
                  setPresses(presses + 1);
                }}
              >
                <View>
                  <Illustration name="settings-theme" height={200} width={200} />
                  {presses > 5 && (
                    <Text style={{ marginTop: 10 }}>
                      Vous avez découvert le thème ultraviolet !
                    </Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
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
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(SettingsTheme);
