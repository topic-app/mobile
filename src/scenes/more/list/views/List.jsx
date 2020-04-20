import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, List } from 'react-native-paper';

function MoreList({ navigation }) {
  return (
    <View>
      <Text>Use List to make a similar menu to Drawer.android.js</Text>
    </View>
  );
}

export default MoreList;

MoreList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
