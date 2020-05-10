import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, Image } from 'react-native';
import { Text, useTheme, Button, List, Divider, DarkTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from '@styles/Styles';
import getLandingStyles from '../styles/Styles';

function LandingArticles({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getLandingStyles(theme);
  const viewpagerRef = React.createRef();

  return (
    <View style={styles.page}>
      <Text>Hello</Text>
    </View>
  );
}

export default LandingArticles;

LandingArticles.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
