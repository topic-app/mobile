import React from 'react';
import { View, StatusBar } from 'react-native';
import { Text, Searchbar, Button, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import getStyles from '@styles/Styles';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      // searchTags: [],
    };
  }

  onChangeSearch = (query) => this.setState({ searchQuery: query });

  render() {
    const { navigation, route, theme } = this.props;
    const { initialCategory } = route.params;
    const { searchQuery } = this.state;
    const styles = getStyles(theme);

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
          <Button onPress={() => navigation.goBack()}>Retour</Button>
        </View>
      </View>
    );
  }
}

export default withTheme(Search);

Search.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      initialCategory: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  theme: PropTypes.shape({}).isRequired,
};
