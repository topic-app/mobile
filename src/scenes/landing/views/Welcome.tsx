import ViewPager from '@react-native-community/viewpager';
import React, { useRef } from 'react';
import { View, Platform, Animated, useWindowDimensions, Easing } from 'react-native';
import { Text, Button, DarkTheme } from 'react-native-paper';

import { Illustration, TranslucentStatusBar } from '@components/index';
import { updateDepartments } from '@redux/actions/api/departments';
import getStyles from '@styles/Styles';
import { trackEvent, useSafeAreaInsets, useTheme } from '@utils/index';

import type { LandingScreenNavigationProp } from '../index';
import getLandingStyles from '../styles/Styles';

type LandingWelcomeProps = {
  navigation: LandingScreenNavigationProp<'Welcome'>;
};

const LandingWelcome: React.FC<LandingWelcomeProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const landingStyles = getLandingStyles(theme);
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
    trackEvent('firstopen');
  }, []);

  const [lastPage, setLastPage] = React.useState(0);

  const backgroundFullHeight =
    Math.max(windowHeight + insets.top + insets.bottom, windowWidth + insets.left + insets.right) *
    1.5;
  const backgroundCollapsedScale = 50 / backgroundFullHeight;

  const animValues = useRef({
    logoScale: new Animated.Value(1),
    logoTranslate: new Animated.Value(0),
    backgroundScale: new Animated.Value(1),
    textColor: new Animated.Value(0),
    illustrations: [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ],
    dots: [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ],
  }).current;

  const animate = (page: number) => {
    let lastPageAnimation: Animated.CompositeAnimation;
    let currentPageAnimation: Animated.CompositeAnimation;

    // Leaving start page
    if (lastPage === 0) {
      lastPageAnimation = Animated.parallel([
        Animated.timing(animValues.logoScale, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animValues.backgroundScale, {
          toValue: backgroundCollapsedScale,
          duration: 300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animValues.logoTranslate, {
          toValue: -230,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animValues.textColor, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false, // can't use native driver for color
        }),
      ]);
    } else {
      lastPageAnimation = Animated.timing(animValues.illustrations[lastPage - 1], {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      });
    }

    // Going back to start page
    if (page === 0) {
      currentPageAnimation = Animated.parallel([
        Animated.timing(animValues.logoScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animValues.backgroundScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animValues.logoTranslate, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animValues.textColor, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false, // can't use native driver for color
        }),
      ]);
    } else {
      currentPageAnimation = Animated.timing(animValues.illustrations[page - 1], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      });
    }

    const dotAnimOut = Animated.timing(animValues.dots[lastPage], {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    });

    const dotAnimIn = Animated.timing(animValues.dots[page], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    });

    Animated.parallel([
      lastPageAnimation,
      dotAnimOut,
      dotAnimIn,
      Animated.sequence([Animated.delay(75), currentPageAnimation]),
    ]).start();
    setLastPage(page);
  };

  const topicPurple = 'rgb(89,41,147)';
  const normalTextColor = theme.dark ? 'rgb(240,240,240)' : 'rgb(0, 0, 0)';

  const normalTextColorAnim = animValues.textColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(230,230,230)', normalTextColor],
    extrapolate: 'clamp',
  });

  const purpleTextColorAnim = animValues.textColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255, 255, 255)', topicPurple],
    extrapolate: 'clamp',
  });

  const dotColors = animValues.dots.map((anim) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(200, 200, 200)', lastPage === 0 ? 'rgb(255,255,255)' : topicPurple],
      extrapolate: 'clamp',
    }),
  );

  return (
    <View style={styles.page}>
      <TranslucentStatusBar barStyle={lastPage === 0 ? 'light-content' : undefined} />
      <View style={landingStyles.welcomeContainer}>
        <View style={landingStyles.bottomContainer}>
          <ViewPager
            onPageSelected={({ nativeEvent }) => animate(nativeEvent.position)}
            style={{ height: '90%', width: '100%', paddingTop: insets.top }}
            initialPage={0}
          >
            <View key="1" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text theme={DarkTheme} style={[landingStyles.title, landingStyles.illustrationText]}>
                Topic
              </Text>
              <Text theme={DarkTheme} style={landingStyles.illustrationText}>
                La malette à outils de l&apos;engagement citoyen
              </Text>
            </View>
            <View key="2" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>Articles</Text>
              <Text style={landingStyles.illustrationText}>
                Découvrez l&apos;actu lycéenne en suivant vos groupes favoris et écrivez vos propres
                articles
              </Text>
            </View>
            <View key="3" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>
                Évènements
              </Text>
              <Text style={landingStyles.illustrationText}>
                Découvrez les prochains évènements pour la jeunesse autour de vous
              </Text>
            </View>
            <View key="4" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>Explorer</Text>
              <Text style={landingStyles.illustrationText}>
                Découvrez les évènements et les lieux proches de vous avec une carte interactive
              </Text>
            </View>
            <View key="5" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>
                Partenaires
              </Text>
              <Text style={landingStyles.illustrationText}>
                Cette application ne serait pas possible sans le support de nos partenaires et
                sponsors
              </Text>
              <Button
                mode="outlined"
                uppercase={Platform.OS !== 'ios'}
                onPress={() =>
                  navigation.push('Root', {
                    screen: 'Main',
                    params: {
                      screen: 'More',
                      params: {
                        screen: 'About',
                        params: { screen: 'List', params: { page: 'sponsors' } },
                      },
                    },
                  })
                }
              >
                Voir les Sponsors
              </Button>
            </View>
          </ViewPager>
          <Animated.View
            style={[
              {
                transform: [
                  { translateY: animValues.logoTranslate },
                  { scale: animValues.logoScale },
                ],
              },
              landingStyles.illustrationContainer,
            ]}
            pointerEvents="none"
          >
            <Illustration name="topic-icon" />
          </Animated.View>
          <View style={landingStyles.illustrationContainer}>
            <Animated.View
              style={{
                // marginTop: insets.top + 30,
                height: backgroundFullHeight,
                width: backgroundFullHeight,
                borderRadius: backgroundFullHeight / 2,
                backgroundColor: colors.primaryBackground,
                transform: [
                  { translateY: animValues.logoTranslate },
                  { scale: animValues.backgroundScale },
                ],
                zIndex: -1,
              }}
              pointerEvents="none"
            />
          </View>
          <Animated.View
            style={[{ opacity: animValues.illustrations[0] }, landingStyles.illustrationContainer]}
            pointerEvents="none"
          >
            <Illustration name="article" />
          </Animated.View>
          <Animated.View
            style={[{ opacity: animValues.illustrations[1] }, landingStyles.illustrationContainer]}
            pointerEvents="none"
          >
            <Illustration name="event" />
          </Animated.View>
          <Animated.View
            style={[{ opacity: animValues.illustrations[2] }, landingStyles.illustrationContainer]}
            pointerEvents="none"
          >
            <Illustration name="explore" />
          </Animated.View>
          <Animated.View
            style={[{ opacity: animValues.illustrations[3] }, landingStyles.illustrationContainer]}
            pointerEvents="none"
          >
            <Illustration name="group" />
          </Animated.View>
          <View
            style={{
              position: 'absolute',
              height: '85%',
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}
            pointerEvents="none"
          >
            <Animated.View style={[landingStyles.dot, { backgroundColor: dotColors[0] }]} />
            <Animated.View style={[landingStyles.dot, { backgroundColor: dotColors[1] }]} />
            <Animated.View style={[landingStyles.dot, { backgroundColor: dotColors[2] }]} />
            <Animated.View style={[landingStyles.dot, { backgroundColor: dotColors[3] }]} />
            <Animated.View style={[landingStyles.dot, { backgroundColor: dotColors[4] }]} />
          </View>
          <Animated.Text style={{ fontSize: 12, color: normalTextColorAnim }}>
            Vous avez un compte?{' '}
            <Animated.Text
              style={[styles.link, { color: purpleTextColorAnim }]}
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Login',
                })
              }
            >
              Connectez-vous
            </Animated.Text>
          </Animated.Text>
          <View style={landingStyles.contentContainer}>
            <Button
              mode="contained"
              color={lastPage === 0 ? 'white' : colors.primary}
              uppercase={Platform.OS !== 'ios'}
              onPress={() => {
                navigation.navigate('Beta');
              }}
            >
              Continuer
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LandingWelcome;
