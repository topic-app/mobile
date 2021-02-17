import sponsors from '@assets/json/sponsors.json';
import ViewPager from '@react-native-community/viewpager';
import React, { useRef } from 'react';
import { View, Platform, Animated, useWindowDimensions, Easing, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Illustration, PlatformTouchable, TranslucentStatusBar } from '@components/index';
import { updateDepartments } from '@redux/actions/api/departments';
import getStyles from '@styles/Styles';
import { trackEvent, useSafeAreaInsets, useTheme } from '@utils/index';

import type { LandingScreenNavigationProp } from '../index';
import getLandingStyles from '../styles/Styles';

type LandingWelcomeProps = {
  navigation: LandingScreenNavigationProp<'Welcome'>;
};

const sponsorsWithImages = sponsors.map((sponsor) => ({
  ...sponsor,
  image: {
    mgen: require('@assets/images/sponsors/mgen.png'),
    jtac: require('@assets/images/sponsors/jtac.png'),
    lesper: require('@assets/images/sponsors/esper.jpg'),
    edtech: require('@assets/images/sponsors/edtech.png'),
  }[sponsor.id as 'mgen' | 'jtac' | 'edtech' | 'lesper'],
}));

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

  const [sponsorContent, setSponsorContent] = React.useState({
    title: 'Partenaires',
    description:
      "Un grand merci à nos partenaires sans qui cette application ne serait pas possible, ainsi qu'aux membres de l'équipe et à nos bêta - testeurs.",
  });

  const backgroundFullHeight =
    Math.max(windowHeight + insets.top + insets.bottom, windowWidth + insets.left + insets.right) *
    1.5;
  const backgroundCollapsedScale = 50 / backgroundFullHeight;

  const animValues = useRef({
    logoScale: new Animated.Value(1),
    logoTranslate: new Animated.Value(0),
    backgroundScale: new Animated.Value(1),
    iosBackgroundOpacity: new Animated.Value(0),
    textColor: new Animated.Value(0),
    illustrations: [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ],
    dots: [
      new Animated.Value(1),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ],
    arrowAnim: new Animated.Value(0),
  }).current;

  // Placeholder Animation
  let arrowAnimation = Animated.delay(50);

  // Arrow animation, start on component mount
  React.useEffect(() => {
    arrowAnimation = Animated.sequence([
      // Wait a bit before starting the animation
      Animated.delay(2500),
      Animated.loop(
        Animated.timing(animValues.arrowAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        { resetBeforeIteration: true },
      ),
    ]);

    arrowAnimation.start();
    return () => arrowAnimation.stop();
  }, []);

  const animate = (page: number) => {
    // animate is triggered on initial screen load
    // but we don't want to animate at that time,
    // so return early
    if (lastPage === 0 && page === 0) {
      return;
    }
    arrowAnimation.stop();
    animValues.arrowAnim.setValue(0);

    let lastPageAnimation: Animated.CompositeAnimation;
    let currentPageAnimation: Animated.CompositeAnimation;

    // Leaving start page
    if (lastPage === 0) {
      lastPageAnimation = Animated.parallel(
        [
          Animated.timing(animValues.logoScale, {
            toValue: 0.5,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(animValues.backgroundScale, {
            toValue: backgroundCollapsedScale,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animValues.logoTranslate, {
            toValue: -230,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(animValues.textColor, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false, // can't use native driver for color
          }),
          Animated.timing(animValues.iosBackgroundOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false, // can't use native driver for color
          }),
        ],
        { stopTogether: false },
      );
    } else {
      lastPageAnimation = Animated.timing(animValues.illustrations[lastPage - 1], {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      });
    }

    // Going back to start page
    if (page === 0) {
      currentPageAnimation = Animated.parallel(
        [
          Animated.timing(animValues.logoScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(animValues.backgroundScale, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
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
          Animated.timing(animValues.iosBackgroundOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false, // can't use native driver for color
          }),
        ],
        { stopTogether: false },
      );
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

    Animated.parallel(
      [
        lastPageAnimation,
        dotAnimOut,
        dotAnimIn,
        Animated.sequence([Animated.delay(75), currentPageAnimation]),
      ],
      { stopTogether: false },
    ).start();
    setLastPage(page);
  };

  const topicPurple = 'rgb(89,41,137)';
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

  const backgroundOpacity = animValues.iosBackgroundOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const dotColors = animValues.dots.map((anim) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(200, 200, 200)', lastPage === 0 ? 'rgb(255,255,255)' : topicPurple],
      extrapolate: 'clamp',
    }),
  );

  const arrowTranslateX = animValues.arrowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, 20],
    extrapolate: 'clamp',
  });

  const arrowOpacity = animValues.arrowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.page}>
      <TranslucentStatusBar barStyle={lastPage === 0 ? 'light-content' : undefined} />
      {Platform.OS === 'ios' && (
        <Animated.View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: backgroundOpacity,
            backgroundColor: topicPurple,
            zIndex: -2,
          }}
        />
      )}
      <View
        style={[
          landingStyles.welcomeContainer,
          Platform.OS === 'ios'
            ? {
                paddingTop: insets.top + 40,
                paddingBottom: insets.bottom,
              }
            : {},
        ]}
      >
        <View style={landingStyles.bottomContainer}>
          <ViewPager
            onPageSelected={({ nativeEvent }) => animate(nativeEvent.position)}
            style={{ height: '90%', width: '100%', paddingTop: insets.top }}
            initialPage={0}
          >
            <View key="1" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Animated.Text
                style={[
                  landingStyles.title,
                  landingStyles.illustrationText,
                  { color: normalTextColorAnim },
                ]}
              >
                Topic
              </Animated.Text>
              <Animated.Text
                style={[landingStyles.illustrationText, { color: normalTextColorAnim }]}
              >
                La malette à outils de l&apos;engagement citoyen
              </Animated.Text>
            </View>
            <View key="2" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Animated.Text
                style={[
                  landingStyles.subtitle,
                  landingStyles.illustrationText,
                  { color: normalTextColorAnim },
                ]}
              >
                Articles
              </Animated.Text>
              <Animated.Text
                style={[landingStyles.illustrationText, { color: normalTextColorAnim }]}
              >
                Découvrez l&apos;actu lycéenne et écrivez vos propres articles. Détaillez vos
                projets, votre engagement, et partagez le avec toute la France !
              </Animated.Text>
            </View>
            <View key="3" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>
                Évènements
              </Text>
              <Text style={landingStyles.illustrationText}>
                Mettez en avant vos actions, vos évènements et vos rassemblements. Partez à la
                recherche des évènements autour de vous avec un outil dédié et personnalisable.
              </Text>
            </View>
            <View key="4" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>Explorer</Text>
              <Text style={landingStyles.illustrationText}>
                Nous vous proposons une carte interactive des territoires français, ou seront
                repertoriés, avec votre aide, les lieux culturels, les évènements et les
                établissements scolaires.
              </Text>
            </View>
            <View key="5" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>Groupes</Text>
              <Text style={landingStyles.illustrationText}>
                Rejoignez des groupes pour représenter vos clubs, associations et organisations
              </Text>
            </View>
            <View key="6" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.subtitle, landingStyles.illustrationText]}>
                {sponsorContent.title}
              </Text>
              <Text style={landingStyles.illustrationText}>{sponsorContent.description}</Text>
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
            {Platform.OS !== 'ios' && (
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
            )}
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
          <Animated.View
            style={[
              {
                opacity: animValues.illustrations[4],
              },
              landingStyles.illustrationContainer,
            ]}
            pointerEvents={lastPage === 5 ? 'box-none' : 'none'}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                height: 100 * 2 + 10,
                width: 100 * 2 + 10,
              }}
            >
              {sponsorsWithImages.map((sponsor, index) => (
                <View
                  key={sponsor.id}
                  style={{
                    marginRight: index % 2 === 0 ? 10 : 0,
                    marginBottom: index < 2 ? 10 : 0,
                  }}
                >
                  <PlatformTouchable
                    onPress={() => {
                      setSponsorContent({ title: sponsor.name, description: sponsor.description });
                    }}
                  >
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                      }}
                      resizeMode="contain"
                      source={sponsor.image}
                    />
                  </PlatformTouchable>
                </View>
              ))}
            </View>
          </Animated.View>

          <View
            style={{
              position: 'absolute',
              height: '85%',
              width: '100%',
              alignItems: 'flex-end',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            pointerEvents="none"
          >
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <Animated.View
                key={val}
                style={[landingStyles.dot, { backgroundColor: dotColors[val] }]}
              />
            ))}
            <Animated.View
              style={{
                position: 'absolute',
                bottom: -6.25,
                right: '27%',
                opacity: arrowOpacity,
                transform: [{ translateX: arrowTranslateX }],
              }}
            >
              <Icon name="chevron-right" size={20} color="white" />
            </Animated.View>
          </View>
          <Animated.Text style={{ fontSize: 12, color: normalTextColorAnim }}>
            Vous avez déjà un compte?{' '}
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
