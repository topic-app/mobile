import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import PropTypes from 'prop-types';

import { styles } from '../../styles/Styles';

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      searchTags: [],
    };
  }

  onChangeSearch = (query) => this.setState({ searchQuery: query });

  render() {
    const { navigation, route } = this.props;
    const { initialCategory } = route.params;
    const { searchQuery } = this.state;

    return (
      <View style={styles.page}>
        <View style={{ height: StatusBar.currentHeight, width: '100%' }} />
        <View style={{ margin: 7 }}>
          <Searchbar
            placeholder="Recherche"
            onChangeText={this.onChangeSearch}
            value={searchQuery}
          />
          <Text>Recherche: {initialCategory}</Text>
          <Button onPress={() => navigation.navigate('Home')}>Retour</Button>
        </View>
      </View>
    );
  }
}

export default SearchScreen;

SearchScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      initialCategory: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
