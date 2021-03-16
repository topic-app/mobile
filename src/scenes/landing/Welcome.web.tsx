import React from 'react';
import { View, Platform } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

import { TranslucentStatusBar } from '@components';
import { updateDepartments } from '@redux/actions/api/departments';
import { trackEvent } from '@utils';

import type { LandingScreenNavigationProp } from '.';
import getStyles from './styles';

type LandingWelcomeProps = {
  navigation: LandingScreenNavigationProp<'Welcome'>;
};

const LandingWelcome: React.FC<LandingWelcomeProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
    trackEvent('firstopen');
  }, []);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <View style={styles.welcomeContainer}>
        <View style={styles.bottomContainer}>
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
          <View style={styles.contentContainer}>
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
