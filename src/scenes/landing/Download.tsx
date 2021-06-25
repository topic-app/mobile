import React from 'react';
import { View, ScrollView, Text, useWindowDimensions } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';

import { updateDepartments } from '@redux/actions/api/departments';
import { trackEvent } from '@utils';

import getStyles from './styles';

const LandingWelcome: React.FC = () => {
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
      <Text>Vous avez déjà téléchargé l'application :)</Text>
    </View>
  );
};

export default LandingWelcome;
