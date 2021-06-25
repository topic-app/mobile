import React from 'react';
import { View, ScrollView, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Divider, Subheading, Title, Button, useTheme } from 'react-native-paper';

import { Illustration } from '@components';
import { updateDepartments } from '@redux/actions/api/departments';
import { handleUrl, trackEvent } from '@utils';

import type { LandingScreenNavigationProp } from '.';
import SelectLocation from './SelectLocation';
import WelcomeAbout from './components/WelcomeAbout';
import WelcomeAppBar from './components/WelcomeAppBar';
import WelcomeSearch from './components/WelcomeSearch';
import WelcomeSlides from './components/WelcomeSlides';
import getStyles from './styles';

type LandingWelcomeProps = {
  navigation: LandingScreenNavigationProp<'Welcome'>;
};

const LandingWelcome: React.FC<LandingWelcomeProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const homepage_illustration = require('@assets/images/bigillustrations/homepage.png');

  const { width } = useWindowDimensions();

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
    trackEvent('firstopen');
  }, []);

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
    <View style={styles.page}>
      <ScrollView>
        <View style={{ height: 'calc(100vh - 110px)', width: '100%' }}>
          <View style={styles.centerIllustrationContainer}>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                <Illustration name="topic-icon-text" height={50} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <View
              style={[
                styles.container,
                { flex: 1, alignSelf: width > 1000 ? 'center' : 'flex-start' },
              ]}
            >
              {width <= 1000 && (
                <View style={{ marginTop: 10, marginBottom: 20 }}>
                  <Image
                    resizeMode="contain"
                    style={{ height: 'calc(65vh - 250px)' }}
                    source={homepage_illustration}
                  />
                </View>
              )}
              <View style={styles.centerIllustrationContainer}>
                <Title style={[styles.title, { textAlign: 'center', fontSize: 24 }]}>
                  Téléchargez l&apos;application Topic
                </Title>
                <Subheading
                  style={[
                    styles.subtitle,
                    { textAlign: 'center', color: colors.subtext, fontSize: 16 },
                  ]}
                >
                  Retrouvez l&apos;actualité engagée et découvrez ce qui se passe autour de vous,
                  directement sur votre téléphone
                </Subheading>
                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                  <Button
                    mode={detectOS() === 'android' ? 'contained' : 'outlined'}
                    onPress={() => {
                      trackEvent('homepage:download-button', { props: { os: 'android' } });
                      handleUrl('https://play.google.com/store/apps/details?id=fr.topicapp.topic', {
                        trusted: true,
                      });
                    }}
                    icon="android"
                    style={{ marginRight: 10 }}
                    uppercase={false}
                  >
                    Android
                  </Button>
                  <Button
                    mode={detectOS() === 'ios' ? 'contained' : 'outlined'}
                    onPress={() => {
                      trackEvent('homepage:download-button', { props: { os: 'ios' } });
                      handleUrl('https://apps.apple.com/fr/app/topic/id1545178171', {
                        trusted: true,
                      });
                    }}
                    icon="apple"
                    style={{ marginLeft: 10 }}
                    uppercase={false}
                  >
                    iOS
                  </Button>
                </View>
              </View>
            </View>
            {width > 1000 && <WelcomeSlides />}
          </View>
        </View>
        <WelcomeAbout showDownload={false} />
      </ScrollView>
    </View>
  );
};

export default LandingWelcome;
