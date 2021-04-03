import Slider from '@react-native-community/slider';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { List, Divider, Switch, Button, Card, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Content, PageContainer } from '@components';
import { updatePrefs } from '@redux/actions/data/prefs';
import { Preferences, Account, State } from '@ts/types';
import { trackEvent } from '@utils';

import type { SettingsScreenNavigationProp } from '.';
import getStyles from './styles';

type SettingsContentProps = {
  preferences: Preferences;
  account: Account;
  navigation: SettingsScreenNavigationProp<'Content'>;
};

const SettingsContent: React.FC<SettingsContentProps> = ({ preferences, account, navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const testData = `
# Lorem ipsum dolor sit amet
Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
### Ut enim ad minim veniam
Quis nostrud exercitation ullamco laboris nisi ut aliquip ex *ea commodo consequat*. **Duis aute irure dolor** in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat ~~non proident~~, sunt in culpa qui officia deserunt mollit anim id est laborum.
>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.
> **Cicero, De finibus bonorum et malorum**
  `;

  return (
    <PageContainer headerOptions={{ title: 'Contenu', subtitle: 'Paramètres' }} centered scroll>
      <ScrollView style={{ height: 300 }}>
        <View style={styles.container}>
          <Card>
            <View style={styles.contentContainer}>
              <Content parser="markdown" data={testData} />
            </View>
          </Card>
        </View>
      </ScrollView>
      <Divider />
      <List.Section>
        <List.Item title="Taille du texte" description={`${preferences.fontSize}px`} />
        <Slider
          minimumValue={12}
          maximumValue={20}
          minimumTrackTintColor={colors.primary}
          thumbTintColor={colors.primary}
          step={1}
          value={preferences.fontSize}
          onValueChange={(data) => {
            trackEvent('prefs:update-font-size', { props: { size: data.toString() } });
            updatePrefs({ fontSize: data });
          }}
        />
      </List.Section>
      <List.Section>
        <Divider />
        <List.Item title="Police" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View style={[styles.container, { justifyContent: 'center' }]}>
            <Button
              uppercase={false}
              labelStyle={{
                color: colors.text,
                fontFamily: 'Roboto',
              }}
              onPress={() => {
                trackEvent('prefs:update-font', { props: { font: 'Roboto' } });
                updatePrefs({ fontFamily: 'Roboto' });
              }}
              mode={preferences.fontFamily === 'Roboto' ? 'outlined' : 'text'}
            >
              Sans serif
            </Button>
          </View>
          <View style={[styles.container, { marginLeft: 0, justifyContent: 'center' }]}>
            <Button
              uppercase={false}
              labelStyle={{
                color: colors.text,
                fontFamily: 'Roboto-Slab',
              }}
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
      </List.Section>
      <Divider />
      <List.Section>
        <List.Item
          title="Retirer le formattage"
          description="Ne pas afficher le gras, l'italique, etc"
          right={() => (
            <Switch
              color={colors.primary}
              value={preferences.stripFormatting}
              onValueChange={(val) => {
                trackEvent('prefs:update-strip-formatting', {
                  props: { value: val ? 'yes' : 'no' },
                });
                updatePrefs({ stripFormatting: val });
              }}
            />
          )}
          onPress={() => {
            trackEvent('prefs:update-strip-formatting', {
              props: { value: !preferences.stripFormatting ? 'yes' : 'no' },
            });
            updatePrefs({ stripFormatting: !preferences.stripFormatting });
          }}
          style={styles.listItem}
        />
      </List.Section>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences, account } = state;
  return { preferences, account };
};

export default connect(mapStateToProps)(SettingsContent);
