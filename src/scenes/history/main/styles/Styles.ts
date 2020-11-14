import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getArticleStyles(_theme: Theme) {
  return StyleSheet.create({
    listItem: { padding: 6 },
  });
}

export default getArticleStyles;
