// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Button } from 'react-native';
// import { customStyles } from '../../../../styles/Styles';
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

import articles from '../data/testDataList.json';

import { styles, colors } from '../../../../styles/Styles';

export default class PetitionDisplayScreen extends React.Component {
  static navigationOptions = {
    title: 'Petitions: Display',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Retour"
        onPress={() => navigate('PetitionList')}
      />
    );
  }
}
