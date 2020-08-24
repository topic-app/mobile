import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import getStyles from '@styles/Styles';

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
