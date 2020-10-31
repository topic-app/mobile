import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getArticleStyles(_theme: Theme) {
  return StyleSheet.create({
    listItem: { padding: 6 },
    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 5,
      paddingTop: 10,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    buttonContainer: {
      marginHorizontal: 10,
      marginVertical: 10,
    },
  });
}

export default getArticleStyles;
