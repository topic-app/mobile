import React from 'react';
import { View, StatusBar } from 'react-native';
import { Text, Searchbar, Button, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import getStyles from '@styles/Styles';

function Search({ navigation, route }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const { initialCategory } = route.params;
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <View style={{ height: StatusBar.currentHeight, width: '100%' }} />
      <View style={{ margin: 7 }}>
        <Searchbar
          placeholder="Recherche"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <Text>Recherche: {initialCategory}</Text>
        <Button onPress={() => navigation.goBack()}>Retour</Button>
      </View>
    </View>
  );
}

export default Search;

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
};
