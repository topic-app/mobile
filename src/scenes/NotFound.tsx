import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { useTheme } from '@utils/index';

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
