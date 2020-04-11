import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, List } from 'react-native-paper';

function DrawerList({ navigation }) {
  return (
    <View>
      <Text>Use List to make a similar drawer menu to Drawer.android.js</Text>
    </View>
  );
}

export default DrawerList;

DrawerList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
