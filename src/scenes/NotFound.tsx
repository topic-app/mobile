import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import getStyles from '@styles/global';

const NotFound = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.centerIllustrationContainer}>
      <Text>Page inexistante</Text>
    </View>
  );
};

export default NotFound;
