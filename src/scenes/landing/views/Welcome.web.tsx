import React, { useRef } from 'react';
import { View, Platform, Animated, useWindowDimensions, Easing } from 'react-native';
import { Text, Button } from 'react-native-paper';

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

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
    trackEvent('firstopen');
  }, []);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <View style={landingStyles.welcomeContainer}>
        <View style={landingStyles.bottomContainer}>
          <Text style={{ fontSize: 12 }}>
            Vous avez un compte?{' '}
            <Text
              style={styles.link}
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Login',
                })
              }
            >
              Connectez-vous
            </Text>
          </Text>
          <View style={landingStyles.contentContainer}>
            <Button
              mode="contained"
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
