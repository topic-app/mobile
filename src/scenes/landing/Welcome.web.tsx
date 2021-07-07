import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';

import { updateDepartments } from '@redux/actions/api/departments';
import { trackEvent } from '@utils';

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

  const { width } = useWindowDimensions();

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
    trackEvent('firstopen');
  }, []);

  return (
    <View style={styles.page}>
      <WelcomeAppBar />
      <ScrollView>
        <View style={{ height: 'calc(100vh - 210px)', width: '100%' }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <SelectLocation navigation={navigation} mode="web" />
            {width > 1000 && <WelcomeSlides />}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <WelcomeAbout />
        </View>
      </ScrollView>
    </View>
  );
};

export default LandingWelcome;
