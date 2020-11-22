import Slider from '@react-native-community/slider';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { List, Divider, Switch, Button, Card } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar, Content } from '@components/index';
import { updatePrefs } from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import { Preferences, Account, State } from '@ts/types';
import { useTheme } from '@utils/index';

import type { SettingsScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';

type SettingsContentProps = {
  preferences: Preferences;
  account: Account;
  navigation: SettingsScreenNavigationProp<'Content'>;
};

const SettingsContent: React.FC<SettingsContentProps> = ({ preferences, account, navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
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
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Contenu et accessibilité',
              subtitle: 'Paramètres',
            },
          },
        }}
      />
      <ScrollView>
        <ScrollView height={300}>
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
            onValueChange={(data) => updatePrefs({ fontSize: data })}
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
                onPress={() => updatePrefs({ fontFamily: 'Roboto' })}
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
                onPress={() => updatePrefs({ fontFamily: 'Roboto-Slab' })}
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
                onPress={() => updatePrefs({ fontFamily: 'Roboto-Mono' })}
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
                }}
                onPress={() => updatePrefs({ fontFamily: 'Open-Dyslexia' })}
                mode={preferences.fontFamily === 'Open-Dyslexia' ? 'outlined' : 'text'}
              >
                Dyslexique
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
                onTouchEnd={() => updatePrefs({ stripFormatting: !preferences.stripFormatting })}
              />
            )}
            onPress={() => updatePrefs({ stripFormatting: !preferences.stripFormatting })}
            style={settingsStyles.listItem}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences, account } = state;
  return { preferences, account };
};

export default connect(mapStateToProps)(SettingsContent);
