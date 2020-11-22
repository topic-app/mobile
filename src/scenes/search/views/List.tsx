import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTheme } from '@utils/index';
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
