import React from 'react';
import { Linking, View } from 'react-native';
import { Button, Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import updatePrefs from '@redux/actions/data/prefs';
import getStyles from '@styles/global';
import { PreferencesState, State, Account } from '@ts/types';
import { trackEvent, useLayout } from '@utils';

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

  const detectOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || '';

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return;
    }

    if (/android/i.test(userAgent)) {
      return 'android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
      }}
    >
      <Divider />
      <PlatformTouchable
        disabled={detectOS() !== 'android' && detectOS() !== 'ios'}
        onPress={
          detectOS() === 'android'
            ? () => {
                trackEvent('banner:download-banner', { props: { os: 'android' } });
                Linking.openURL('https://play.google.com/store/apps/details?id=fr.topicapp.topic');
              }
            : detectOS() === 'ios'
            ? () => {
                trackEvent('banner:download-button', { props: { os: 'ios' } });
                Linking.openURL('https://apps.apple.com/fr/app/topic/id1545178171');
              }
            : undefined
        }
      >
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
                Téléchargez l&apos;appli{!mobile && 'cation'}
              </Text>
            </View>
          </View>
          {layout === 'desktop' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.container}>
                <Button
                  mode="outlined"
                  color={colors.primary}
                  icon="android"
                  uppercase={false}
                  onPress={() => {
                    trackEvent('banner:download-button', { props: { os: 'android' } });
                    Linking.openURL(
                      'https://play.google.com/store/apps/details?id=fr.topicapp.topic',
                    );
                  }}
                >
                  Android
                </Button>
              </View>
              <View style={styles.container}>
                <Button
                  mode="outlined"
                  color={colors.primary}
                  icon="apple"
                  uppercase={false}
                  onPress={() => {
                    trackEvent('banner:download-button', { props: { os: 'ios' } });
                    Linking.openURL('https://apps.apple.com/fr/app/topic/id1545178171');
                  }}
                >
                  iOS
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
              {detectOS() !== 'ios' && (
                <View style={styles.container}>
                  <IconButton
                    accessibilityLabel="Android"
                    color={colors.primary}
                    icon="android"
                    onPress={() => {
                      trackEvent('banner:download-button', { props: { os: 'android' } });
                      Linking.openURL(
                        'https://play.google.com/store/apps/details?id=fr.topicapp.topic',
                      );
                    }}
                  />
                </View>
              )}
              {detectOS() !== 'android' && (
                <View style={styles.container}>
                  <IconButton
                    accessibilityLabel="iOS"
                    color={colors.primary}
                    icon="apple"
                    onPress={() => {
                      trackEvent('banner:download-button', { props: { os: 'ios' } });
                      Linking.openURL('https://apps.apple.com/fr/app/topic/id1545178171');
                    }}
                  />
                </View>
              )}
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
