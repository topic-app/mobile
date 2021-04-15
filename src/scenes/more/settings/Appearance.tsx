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

const testData = `
## Lorem ipsum dolor sit amet
Quis nostrud exercitation ullamco laboris nisi ut aliquip ex *ea commodo consequat*. **Duis aute irure dolor** in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat ~~non proident~~, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

type SettingsAppearance = {
  preferences: Preferences;
  account: Account;
  navigation: SettingsScreenNavigationProp<'Appearance'>;
};

const SettingsAppearance: React.FC<SettingsAppearance> = ({ preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const visibleThemes = preferences.themeEasterEggDiscovered
    ? Object.values(themes)
    : Object.values(themes).filter((t) => !t.egg);

  const [presses, setPresses] = React.useState(0);

  return (
    <PageContainer headerOptions={{ title: 'Apparence', subtitle: 'Paramètres' }} centered scroll>
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
      <SettingSection title="Thème" bottomDivider>
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
      </SettingSection>
      <SettingSection title="Texte">
        <View style={{ maxHeight: 250, overflow: 'hidden' }}>
          <View style={styles.container}>
            <Card>
              <View style={styles.contentContainer}>
                <Content parser="markdown" data={testData} />
              </View>
            </Card>
          </View>
        </View>
        <Setting title="Taille du texte" description={`${preferences.fontSize}px`} />
        <Slider
          step={1}
          minimumValue={12}
          maximumValue={20}
          accessibilityLabel="Taille du texte"
          minimumTrackTintColor={colors.primary}
          thumbTintColor={colors.primary}
          onValueChange={(data) => {
            trackEvent('prefs:update-font-size', { props: { size: data.toString() } });
            updatePrefs({ fontSize: data });
          }}
          value={preferences.fontSize}
        />
        <Setting title="Police" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View style={[styles.container, { justifyContent: 'center' }]}>
            <Button
              mode={preferences.fontFamily === 'system' ? 'outlined' : 'text'}
              labelStyle={{ color: colors.text }}
              accessibilityLabel="Police du systême"
              onPress={() => {
                trackEvent('prefs:update-font', { props: { font: 'system' } });
                updatePrefs({ fontFamily: 'system' });
              }}
              uppercase={false}
            >
              Systême
            </Button>
          </View>
          <View style={[styles.container, { marginLeft: 0, justifyContent: 'center' }]}>
            <Button
              uppercase={false}
              labelStyle={{
                color: colors.text,
                fontFamily: 'Roboto-Slab',
              }}
              accessibilityLabel="Police Serif"
              onPress={() => {
                trackEvent('prefs:update-font', { props: { font: 'Roboto-Slab' } });
                updatePrefs({ fontFamily: 'Roboto-Slab' });
              }}
              mode={preferences.fontFamily === 'Roboto-Slab' ? 'outlined' : 'text'}
            >
              Serif
            </Button>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View style={styles.container}>
            <Button
              uppercase={false}
              labelStyle={{
                color: colors.text,
                fontFamily: 'Roboto-Mono',
              }}
              onPress={() => {
                trackEvent('prefs:update-font', { props: { font: 'Roboto-Mono ' } });
                updatePrefs({ fontFamily: 'Roboto-Mono' });
              }}
              accessibilityLabel="Poline Mono"
              mode={preferences.fontFamily === 'Roboto-Mono' ? 'outlined' : 'text'}
            >
              Mono
            </Button>
          </View>
          <View style={[styles.container, { marginLeft: 0 }]}>
            <Button
              uppercase={false}
              labelStyle={{
                color: colors.text,
                fontFamily: 'OpenDyslexic',
              }}
              accessibilityLabel="Police Dyslexie"
              onPress={() => {
                trackEvent('prefs:update-font', { props: { font: 'OpenDyslexic' } });
                updatePrefs({ fontFamily: 'OpenDyslexic' });
              }}
              mode={preferences.fontFamily === 'OpenDyslexic' ? 'outlined' : 'text'}
            >
              Dyslexie
            </Button>
          </View>
        </View>
        <SettingToggle
          title="Retirer le formattage"
          description="Ne pas affichier le gras, l'italique, etc"
          value={preferences.stripFormatting}
          onPress={() => {
            trackEvent('prefs:update-strip-formatting', {
              props: { value: preferences.stripFormatting ? 'no' : 'yes' },
            });
            updatePrefs({ stripFormatting: !preferences.stripFormatting });
          }}
        />
      </SettingSection>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(SettingsAppearance);
