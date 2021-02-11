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

  const logoScaleAnim = useRef(new Animated.Value(1)).current;
  const logoTranslateAnim = useRef(new Animated.Value(0)).current;
  const backgroundScaleAnim = useRef(new Animated.Value(1)).current;
  const textColorAnim = useRef(new Animated.Value(0)).current;
  const animValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const animate = (page: number) => {
    let lastPageAnimation: Animated.CompositeAnimation;
    let currentPageAnimation: Animated.CompositeAnimation;

    // Leaving start page
    if (lastPage === 0) {
      lastPageAnimation = Animated.parallel([
        Animated.timing(logoScaleAnim, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundScaleAnim, {
          toValue: backgroundCollapsedScale,
          duration: 300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateAnim, {
          toValue: -230,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(textColorAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false, // can't use native driver for color
        }),
      ]);
    } else {
      lastPageAnimation = Animated.timing(animValues[lastPage - 1], {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      });
    }

    // Going back to start page
    if (page === 0) {
      currentPageAnimation = Animated.parallel([
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundScaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(textColorAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false, // can't use native driver for color
        }),
      ]);
    } else {
      currentPageAnimation = Animated.timing(animValues[page - 1], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      });
    }

    Animated.parallel([
      lastPageAnimation,
      Animated.sequence([Animated.delay(75), currentPageAnimation]),
    ]).start();
    setLastPage(page);
  };

  const normalTextColor = theme.dark ? 'rgb(240,240,240)' : 'rgb(0, 0, 0)';

  const normalTextColorAnim = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(230,230,230)', normalTextColor],
    extrapolate: 'clamp',
  });

  const purpleTextColorAnim = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255, 255, 255)', 'rgb(89,41,137)'],
    extrapolate: 'clamp',
  });

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
              <Text style={[landingStyles.title, landingStyles.illustrationText]}>Articles</Text>
              <Text style={landingStyles.illustrationText}>
                Découvrez l&apos;actu lycéenne en suivant vos groupes favoris et écrivez vos propres
                articles
              </Text>
            </View>
            <View key="3" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.title, landingStyles.illustrationText]}>Évènements</Text>
              <Text style={landingStyles.illustrationText}>
                Découvrez les prochains évènements pour la jeunesse autour de vous
              </Text>
            </View>
            <View key="4" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={[landingStyles.title, landingStyles.illustrationText]}>Explorer</Text>
              <Text style={landingStyles.illustrationText}>
                Découvrez les évènements et les lieux proches de vous avec une carte interactive
              </Text>
            </View>
          </ViewPager>
          <Animated.View
            style={[
              { transform: [{ translateY: logoTranslateAnim }, { scale: logoScaleAnim }] },
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
                transform: [{ translateY: logoTranslateAnim }, { scale: backgroundScaleAnim }],
                zIndex: -1,
              }}
              pointerEvents="none"
            />
          </View>
          <Animated.View
            style={[{ opacity: animValues[0] }, landingStyles.illustrationContainer]}
            pointerEvents="none"
          >
            <Illustration name="article" />
          </Animated.View>
          <Animated.View
            style={[{ opacity: animValues[1] }, landingStyles.illustrationContainer]}
            pointerEvents="none"
          >
            <Illustration name="event" />
          </Animated.View>
          <Animated.View
            style={[{ opacity: animValues[2] }, landingStyles.illustrationContainer]}
            pointerEvents="none"
          >
            <Illustration name="explore" />
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
            <Animated.View
              style={[
                landingStyles.dot,
                { backgroundColor: lastPage === 0 ? colors.primary : normalTextColor },
              ]}
            />
            <Animated.View
              style={[
                landingStyles.dot,
                { backgroundColor: lastPage === 1 ? colors.primary : normalTextColor },
              ]}
            />
            <Animated.View
              style={[
                landingStyles.dot,
                { backgroundColor: lastPage === 2 ? colors.primary : normalTextColor },
              ]}
            />
            <Animated.View
              style={[
                landingStyles.dot,
                { backgroundColor: lastPage === 3 ? colors.primary : normalTextColor },
              ]}
            />
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
              color="white"
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
