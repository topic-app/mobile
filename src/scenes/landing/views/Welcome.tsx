import ViewPager from '@react-native-community/viewpager';
import React from 'react';
import { View, Platform, StatusBar, Animated, useWindowDimensions, Easing } from 'react-native';
import { Text, Button, Divider, DarkTheme } from 'react-native-paper';

import { Illustration, TranslucentStatusBar } from '@components/index';
import { updateDepartments } from '@redux/actions/api/departments';
import getStyles from '@styles/Styles';
import { trackEvent, useSafeAreaInsets, useTheme } from '@utils/index';

import type { LandingScreenNavigationProp } from '../index';
import getLandingStyles from '../styles/Styles';

const items = [
  {
    index: 0,
    title: 'Articles',
    description:
      "Découvrez l'actu lycéenne en suivant vos groupes favoris et écrivez vos propres articles",
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'newspaper',
  },
  {
    index: 1,
    title: 'Évènements',
    description: 'Découvrez les prochains évènements pour la jeunesse autour de vous',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'calendar',
  },
  /* {
    index: 2,
    title: 'Pétitions',
    description:
      'Faites entendre votre voix en signant ou créant des pétitions et en répondant aux votes',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'comment-check-outline',
  }, */
  {
    index: 2,
    title: 'Explorer',
    description: 'Découvrez les évènements et les lieux proches de vous avec une carte interactive',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'compass-outline',
  },
  {
    index: 3,
    divider: true,
    title: 'Groupes',
    description:
      'Rejoignez et créez des groupes et représentez vos associations, organisations et clubs favoris',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'account-group-outline',
  },
];

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

  const backgroundFullHeight =
    Math.max(windowHeight + insets.top + insets.bottom, windowWidth + insets.left + insets.right) *
    1.5;
  const backgroundCollapsedScale = 50 / backgroundFullHeight;

  const logoScaleAnim = new Animated.Value(1);
  const logoTranslateAnim = new Animated.Value(0);
  const backgroundScaleAnim = new Animated.Value(1);
  const textColorAnim = new Animated.Value(0);
  const animValues = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];

  let lastPage = 0;

  const animate = (page: number) => {
    let lastPageAnimation: Animated.CompositeAnimation;
    let currentPageAnimation: Animated.CompositeAnimation;

    // Leaving start page
    if (lastPage === 0) {
      StatusBar.setBarStyle(theme.statusBarStyle);
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
      StatusBar.setBarStyle('light-content');
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
    lastPage = page;
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
      <TranslucentStatusBar barStyle="light-content" />
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
                Bienvenue sur Topic
              </Text>
              <Text theme={DarkTheme} style={landingStyles.illustrationText}>
                La malette à outils de l&apos;engagement citoyen
              </Text>
            </View>
            <View key="2" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={landingStyles.illustrationText}>Lisez</Text>
            </View>
            <View key="3" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={landingStyles.illustrationText}>Lisez</Text>
            </View>
            <View key="4" style={landingStyles.viewPage}>
              <View style={{ height: '70%', width: '70%' }} />
              <Text style={landingStyles.illustrationText}>Lisez</Text>
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
          <Animated.Text style={{ fontSize: 12, color: normalTextColorAnim }}>
            Vous avez un compte?{' '}
            <Animated.Text style={[styles.link, { color: purpleTextColorAnim }]}>
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
      {/* <ScrollView>
        <View style={landingStyles.contentContainer}>
          <List.Section>
            <List.Subheader theme={DarkTheme}>Découvrez l&apos;application</List.Subheader>
            {items.map((item) => (
              <View key={shortid()}>
                {item.divider && <Divider theme={DarkTheme} />}
                <List.Item
                  theme={DarkTheme}
                  title={item.title}
                  description={item.description}
                  left={({ color }) => <List.Icon color={color} icon={item.icon} />}
                  right={({ color }) => <List.Icon color={color} icon="chevron-right" />}
                  onPress={() => {
                    trackEvent('landing:press-discover-button', { props: { element: item.title } });
                    navigation.navigate('Info', { index: item.index });
                  }}
                />
              </View>
            ))}
          </List.Section>
          <Divider theme={DarkTheme} />
          <View>
            <PlatformTouchable
              onPress={() => {
                trackEvent('landing:press-sponsors-button');
                navigation.navigate('Info', { index: 4 });
              }}
            >
              <View
                style={{
                  marginVertical: 30,
                  marginHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: 'white', opacity: 0.5 }}>Association Topic App</Text>
                <Text style={{ color: 'white', opacity: 0.5 }}>Partenaires</Text>
              </View>
            </PlatformTouchable>
          </View>
        </View>
      </ScrollView> */}
      <Divider theme={DarkTheme} />
      <View style={landingStyles.contentContainer}>
        <View style={landingStyles.buttonContainer}>
          <Button
            mode="contained"
            color="white"
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              navigation.navigate('Beta');
            }}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    </View>
  );
};

export default LandingWelcome;
