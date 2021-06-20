import {
  useFonts,
  RobotoMono_400Regular,
  RobotoMono_400Regular_Italic,
} from '@expo-google-fonts/roboto-mono';
import { RobotoSlab_400Regular } from '@expo-google-fonts/roboto-slab';
import Slider from '@react-native-community/slider';
import React from 'react';
import { View, Appearance, TouchableWithoutFeedback } from 'react-native';
import { Button, Card, useTheme, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  Content,
  Illustration,
  PageContainer,
  Setting,
  SettingRadio,
  SettingSection,
  SettingToggle,
} from '@components';
import { updatePrefs } from '@redux/actions/data/prefs';
import themes from '@styles/helpers/theme';
import { Preferences, Account, State } from '@ts/types';
import { trackEvent } from '@utils';

import type { SettingsScreenNavigationProp } from '.';
import getStyles from './styles';

type SettingsTheme = {
  preferences: Preferences;
  account: Account;
  navigation: SettingsScreenNavigationProp<'Theme'>;
};

const SettingsTheme: React.FC<SettingsTheme> = ({ preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const visibleThemes = preferences.themeEasterEggDiscovered
    ? Object.values(themes)
    : Object.values(themes).filter((t) => !t.egg);

  const [presses, setPresses] = React.useState(0);

  return (
    <PageContainer headerOptions={{ title: 'Thème', subtitle: 'Paramètres' }} centered scroll>
      <View style={styles.centerIllustrationContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (presses > 5) {
              trackEvent('prefs:discover-easter-egg');
              updatePrefs({ themeEasterEggDiscovered: true });
            }
            setPresses(presses + 1);
          }}
        >
          <View>
            <Illustration name="settings-theme" />
            {presses > 5 && !preferences.themeEasterEggDiscovered ? (
              <Text style={{ marginTop: 10 }}>Vous avez découvert le thème ultraviolet !</Text>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <SettingRadio
        title={`Utiliser le thème du système (${
          Appearance.getColorScheme() === 'dark' ? 'Sombre' : 'Clair'
        })`}
        checked={preferences.useSystemTheme}
        onPress={() => {
          trackEvent('prefs:change-theme', { props: { theme: 'system' } });
          updatePrefs({ useSystemTheme: true });
        }}
      />
      {visibleThemes.map(({ name, value }) => (
        <SettingRadio
          key={name}
          accessibilityLabel={
            theme.egg
              ? 'Bravo ! Vous avez découvert l’easter egg dans les thèmes. Et puisque vous utilisez un lecteur d’écran, voila un deuxième easter egg.'
              : theme.name
          }
          title={name}
          checked={value === preferences.theme && !preferences.useSystemTheme}
          onPress={() => {
            trackEvent('prefs:change-theme', { props: { theme: value } });
            updatePrefs({ theme: value, useSystemTheme: false });
          }}
        />
      ))}
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(SettingsTheme);
