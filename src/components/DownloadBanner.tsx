import React from 'react';
import { Linking, View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import updatePrefs from '@redux/actions/data/prefs';
import getStyles from '@styles/global';
import { PreferencesState, State, Account } from '@ts/types';
import { useLayout } from '@utils';

import Illustration from './Illustration';
import { PlatformTouchable } from './PlatformComponents';

type Props = {
  preferences: PreferencesState;
  account: Account;
  mobile?: boolean;
};

const DownloadBanner: React.FC<Props> = ({ preferences, mobile, account }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const layout = useLayout();

  if (!preferences.showDownloadBanner || account.loggedIn) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        shadowRadius: 5,
        shadowColor: 'grey',
      }}
    >
      <PlatformTouchable onPress={() => Linking.openURL('https://beta.topicapp.fr')}>
        <View style={{ flexDirection: 'row', alignItems: 'stretch', flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Illustration
                name="topic-icon"
                height={mobile ? 24 : 32}
                width={mobile ? 24 : 32}
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: mobile ? 18 : 22, color: colors.muted }}>
                Téléchargez l'appli{!mobile && 'cation'}
              </Text>
            </View>
          </View>
          {layout === 'desktop' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.container}>
                <Button
                  mode="outlined"
                  color={colors.primary}
                  icon="download"
                  onPress={() => Linking.openURL('https://beta.topicapp.fr')}
                >
                  Télécharger
                </Button>
              </View>
              <View style={styles.container}>
                <IconButton
                  icon="close"
                  accessibilityLabel="Cacher la bannière"
                  color={colors.disabled}
                  onPress={() => updatePrefs({ showDownloadBanner: false })}
                />
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.container}>
                <IconButton
                  accessibilityLabel="Android"
                  color={colors.primary}
                  icon="android"
                  onPress={() =>
                    Linking.openURL(
                      'https://play.google.com/store/apps/details?id=fr.topicapp.topic',
                    )
                  }
                />
              </View>
              <View style={styles.container}>
                <IconButton
                  accessibilityLabel="iOS"
                  color={colors.primary}
                  icon="apple"
                  onPress={() => Linking.openURL('https://testflight.apple.com/join/87FfV2f8')}
                />
              </View>
              <View style={styles.container}>
                <IconButton
                  icon="close"
                  accessibilityLabel="Cacher la bannière"
                  color={colors.disabled}
                  onPress={() => updatePrefs({ showDownloadBanner: false })}
                />
              </View>
            </View>
          )}
        </View>
      </PlatformTouchable>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences, account } = state;
  return { preferences, account };
};

export default connect(mapStateToProps)(DownloadBanner);
