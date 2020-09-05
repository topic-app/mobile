import { StyleSheet } from 'react-native';

function getEventStyles(theme) {
  const { colors } = theme;
  return StyleSheet.create({
    date: {
      fontSize: 15,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 19,
      marginBottom: 5,
      marginLeft: 20,
    },
    description: {
      marginTop: 20,
      marginHorizontal: 20,
    },
    time: {
      fontWeight: 'bold',
      marginLeft: 10,
    },
    subject: {
      marginLeft: 20,
    },
  });
}

export default getEventStyles;
