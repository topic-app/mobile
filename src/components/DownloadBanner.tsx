import React from 'react';
import { Linking, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import updatePrefs from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import { PreferencesState, State } from '@ts/types';
import { useLayout, useTheme } from '@utils';

import Illustration from './Illustration';
import { PlatformTouchable } from './PlatformComponents';

type Props = {
  preferences: PreferencesState;
  mobile?: boolean;
};

const DownloadBanner: React.FC<Props> = ({ preferences, mobile }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  if (!preferences.showDownloadBanner) {
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
                Rejoignez la bêta {!mobile && "de l'application"}
              </Text>
            </View>
          </View>
          {useLayout() == 'desktop' ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.container}>
              <Button
                mode="outlined"
                color={colors.primary}
                icon="download"
                onPress={() =>
                  Linking.openURL('https://beta.topicapp.fr')
                }
              >
                Plus d&apos;infos
              </Button>
            </View></View> : <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.container}>
              <Button
                mode="outlined"
                color={colors.primary}
                icon="android"
                onPress={() =>
                  Linking.openURL('https://play.google.com/store/apps/details?id=fr.topicapp.topic')
                }
              >
                Android
              </Button>
            </View>
            <View style={styles.container}>
              <Button
                mode="outlined"
                color={colors.primary}
                icon="apple"
                onPress={() => Linking.openURL('https://testflight.apple.com/join/87FfV2f8')}
              >
                iOS
              </Button>
            </View>
            <View style={styles.container}>
              <IconButton
                icon="close"
                color={colors.disabled}
                onPress={() => updatePrefs({ showDownloadBanner: false })}
              />
            </View>
          </View>
        </View>
      </PlatformTouchable>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(DownloadBanner);
