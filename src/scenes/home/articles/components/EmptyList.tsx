import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FullscreenIllustration } from '@components';
import { ArticleRequestState } from '@ts/types';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';

type ArticleEmptyListProps = {
  sectionKey: string;
  group?: string;
  reqState: ArticleRequestState;
  changeTab: (tabKey: string) => any;
};

const ArticleEmptyList: React.FC<ArticleEmptyListProps> = ({
  sectionKey,
  group,
  reqState,
  changeTab,
}) => {
  const navigation = useNavigation<HomeTwoScreenNavigationProp<'Article'>>();
  const height = useWindowDimensions().height - 300;

  const theme = useTheme();
  const { colors } = theme;

  if (
    (group === 'categories' && reqState.list.success) ||
    (group === 'quicks' && reqState.search?.success)
  ) {
    if (sectionKey === 'unread') {
      return (
        <FullscreenIllustration
          style={{ height }}
          illustration="article-completed"
          buttonLabel="Voir les articles lus"
          buttonOnPress={() => changeTab('all')}
        >
          Vous avez lu tous les articles !
        </FullscreenIllustration>
      );
    } else if (sectionKey === 'all') {
      return (
        <FullscreenIllustration
          style={{ height }}
          illustration="article"
          buttonLabel="Localisation"
          buttonOnPress={() =>
            navigation.navigate('Main', {
              screen: 'Params',
              params: {
                screen: 'Article',
              },
            })
          }
        >
          Aucun article pour cette localisation
        </FullscreenIllustration>
      );
    } else if (sectionKey === 'following') {
      return (
        <FullscreenIllustration illustration="article" style={{ height }}>
          Vous verrez içi les articles des groupes et utilisateurs que vous suivez
        </FullscreenIllustration>
      );
    } else {
      return (
        <FullscreenIllustration illustration="article" style={{ height }}>
          Aucun article dans cette catégorie
        </FullscreenIllustration>
      );
    }
  } else if (
    (group === 'categories' && reqState.list.loading) ||
    (group === 'quicks' && reqState.search?.loading)
  ) {
    return <ActivityIndicator color={colors.primary} size="large" />;
  } else if (
    (group === 'categories' && reqState.list.error) ||
    (group === 'quicks' && reqState.search?.error)
  ) {
    return <FullscreenIllustration illustration="article-greyed" style={{ height }} />;
  }
  return null;
};

export default ArticleEmptyList;
