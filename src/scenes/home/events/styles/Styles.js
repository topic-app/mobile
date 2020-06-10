import { StyleSheet } from 'react-native';

function getEventStyles(theme) {
  const { colors } = theme;
  return StyleSheet.create({
    cardDescription: {
      fontSize: 15,
    },
  });
}

export default getEventStyles;
