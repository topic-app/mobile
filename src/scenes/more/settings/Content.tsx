import { Roboto_400Regular } from '@expo-google-fonts/roboto';
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

const OpenDyslexic = require('@assets/fonts/OpenDyslexic/OpenDyslexic-Regular.otf');
const OpenDyslexic_Italic = require('@assets/fonts/OpenDyslexic/OpenDyslexic-Italic.otf');

type SettingsAppearance = {
  preferences: Preferences;
  account: Account;
  navigation: SettingsScreenNavigationProp<'Content'>;
};

const SettingsAppearance: React.FC<SettingsAppearance> = ({ preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  useFonts({
    Roboto: Roboto_400Regular,
    'Roboto-Slab': RobotoSlab_400Regular,

    'Roboto-Mono': RobotoMono_400Regular,
    'Roboto-Mono_Italic': RobotoMono_400Regular_Italic,

    OpenDyslexic,
    OpenDyslexic_Italic,
  });

  const fonts: {
    name: string;
    font: 'system' | 'Roboto' | 'Roboto-Slab' | 'Roboto-Mono' | 'OpenDyslexic';
  }[] = [
    {
      name: 'Système',
      font: 'system',
    },
    {
      name: 'Sans serif',
      font: 'Roboto',
    },
    {
      name: 'Serif',
      font: 'Roboto-Slab',
    },
    {
      name: 'Mono',
      font: 'Roboto-Mono',
    },
    {
      name: 'Dyslexie',
      font: 'OpenDyslexic',
    },
  ];

  const testData = `
  # Exemple de contenu
  Vous pouvez tester les paramètres ici. Voila du **gras**, de _l'italique_, du ~~barré~~

  > Qui sera affiché par défaut ?
  > - Tom Ruchier-Berquet, fondateur de Topic App
  `;

  return (
    <PageContainer headerOptions={{ title: 'Contenu', subtitle: 'Paramètres' }} centered scroll>
      <View style={{ marginTop: 20 }}>
        <SettingSection title="Police">
          {fonts.map((f) => (
            <SettingRadio
              key={f.name}
              title={f.name}
              titleStyle={{ fontFamily: f.font }}
              checked={preferences.fontFamily === f.font}
              onPress={() => {
                trackEvent('prefs:update-font', { props: { font: f.font } });
                updatePrefs({ fontFamily: f.font });
              }}
            />
          ))}
        </SettingSection>
      </View>
      <View style={{ marginTop: 20 }}>
        <SettingSection title="Accessibilité">
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
            style={{ marginBottom: 20 }}
          />
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
      </View>
      <View style={{ marginTop: 40, maxHeight: 250, overflow: 'hidden' }}>
        <View style={styles.container}>
          <Card>
            <View style={styles.contentContainer}>
              <Content parser="markdown" data={testData} />
            </View>
          </Card>
        </View>
      </View>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(SettingsAppearance);
