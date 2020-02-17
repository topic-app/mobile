// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { styles } from '../../../../styles/Styles';
// import { withTheme } from 'react-native-paper';

export default class PetitionListScreen extends React.Component {
  static navigationOptions = {
    title: 'Pétitions',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.page}>
        <Text style={styles.text}>Yo!</Text>
      </View>
    );
  }
}

/*
function MyComponent(props) {
  const { colors } = props.theme;

  return (
    <View style={{ backgroundColor: colors.background, flex: 1}}>
      <Text style={{ color: colors.text }}>Yo!</Text>
    </View>
  );
}
*/
