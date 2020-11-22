import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getPetitionStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    progress: {
      height: 12,
    },
    progressRadius: {
      borderRadius: 6,
    },
    progressContainer: {
      marginVertical: 15,
    },
    signText: {
      fontSize: 14,
    },
    voteLabel: {
      fontSize: 13,
      backgroundColor: colors.primary,
      borderRadius: 5,
      paddingHorizontal: 4,
      paddingVertical: 1,
      color: 'white',
      // Note: left property is manipulated in cards/Petition.jsx
      position: 'absolute',
      top: -4.5, // Make sure label properly centered when changing padding or fontSize
    },
    voteLabelMultiple: {
      fontSize: 13,
      backgroundColor: colors.primary,
      borderRadius: 5,
      paddingHorizontal: 4,
      paddingVertical: 1,
      color: 'white',
      position: 'absolute',
      top: -16,
    },
  });
}

export default getPetitionStyles;
