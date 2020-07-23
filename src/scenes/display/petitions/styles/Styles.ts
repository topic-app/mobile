import { StyleSheet } from 'react-native';

function getPetitionStyles(theme) {
  const { colors } = theme;
  return StyleSheet.create({
    progress: {
      height: 12,
      borderRadius: 6,
    },
    progressContainer: {
      marginVertical: 15,
    },
    signText: {
      fontSize: 14,
    },
    signTextNoGoal: {
      fontSize: 20,
    },
    signTextNumber: {
      fontSize: 30,
    },
    voteLabel: {
      fontSize: 13,
      backgroundColor: colors.primary,
      borderRadius: 5,
      paddingHorizontal: 4,
      paddingVertical: 1,
      color: 'white',
      // Note: left property is manipulated in Card.jsx
      position: 'absolute',
      top: -4.5, // Make sure label properly centered when changing padding or fontSize
    },
  });
}

export default getPetitionStyles;
