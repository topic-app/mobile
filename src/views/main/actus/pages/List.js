import React from 'react';
import { View, FlatList } from 'react-native';

import ActuComponentListCard from '../components/listCard';

import data from '../data/testDataList.json';
import actusStyles from '../styles/Styles';
import { customStyles } from '../../../../styles/Styles';

export default class ActuListScreen extends React.Component {
  static navigationOptions = {
    title: 'Actus et évènements',
    ...customStyles.header,
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <View style={actusStyles.page}>
        <FlatList
          data={data}
          renderItem={(article) => (<ActuComponentListCard article={article.item} />)}
        />
      </View>
    );
  }
}
