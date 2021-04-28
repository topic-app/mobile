import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Text, Title, Button, useTheme, Searchbar } from 'react-native-paper';

import { Illustration, TranslucentStatusBar } from '@components';
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
      <View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ margin: 10 }}>
            <Illustration name="topic-icon" style={{ height: 50, width: 50 }} />
          </View>
          <Text style={[styles.title, { fontSize: 30, marginTop: 15 }]}>Topic</Text>
          <View
            style={[{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginTop: 10 }]}
          >
            <Button
              style={{ height: 35, margin: 5 }}
              mode="contained"
              uppercase={Platform.OS !== 'ios'}
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Login',
                })
              }
            >
              Se connecter
            </Button>
            <Button
              style={{ height: 35, margin: 5, marginRight: 10 }}
              mode="contained"
              uppercase={Platform.OS !== 'ios'}
              onPress={() => {
                navigation.navigate('Beta');
              }}
            >
              Créer un compte
            </Button>
          </View>
        </View>
      </View>
      <View>
        <Divider />
        <Title style={[styles.title, { fontSize: 30, alignSelf: 'center', marginTop: 20 }]}>
          Choisissez votre école
        </Title>
        <View style={{ width: 400, marginVertical: 20, alignSelf: 'center' }}>
          <Searchbar placeholder="Rechercher" />
        </View>
      </View>
    </View>
  );
};

export default LandingWelcome;
