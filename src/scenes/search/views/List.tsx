import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';

function SearchList() {
  const styles = getStyles(useTheme());
  return (
    <View style={styles.page}>
      <Text>Search List</Text>
    </View>
  );
}

export default SearchList;
