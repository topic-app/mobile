// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import {
  Chip,
  Avatar,
} from 'react-native-paper';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
// Todo in future: blur when you pull up
// import { BlurView } from 'expo-blur';

import { styles, colors } from '../../../../styles/Styles';
import places from '../data/testQueryResults.json';

export default class CarteDisplayScreen extends React.Component {
  static navigationOptions = {
    title: 'Carte: Display',
  };

  render() {
    const { navigation } = this.props;
    const { state } = navigation;
    const { id } = state.params;
    const place = places[id];

    console.log('Full-screen display!');
    console.log(place);

    return (
      <View style={{ flex: 1 }}>
        <Text>I am the full-screen display content</Text>
      </View>
    );
  }
}

CarteDisplayScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};