import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FullscreenIllustration } from '@components/index';
import { ArticleRequestState } from '@ts/types';
import { useTheme } from '@utils';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';

type ArticleEmptyListProps = {
  tab: string;
  sectionKey: string;
  reqState: ArticleRequestState;
  changeTab: (tabKey: string) => void;
};

const ArticleEmptyList: React.FC<ArticleEmptyListProps> = ({
  tab,
  sectionKey,
  reqState,
  changeTab,
}) => {
  const navigation = useNavigation<HomeTwoScreenNavigationProp<'Article'>>();
  const height = useWindowDimensions().height - 300;

  const theme = useTheme();
  const { colors } = theme;

  if (
    (sectionKey === 'categories' && reqState.list.success) ||
    (sectionKey === 'quicks' && reqState.search?.success) ||
    sectionKey === 'lists'
  ) {
    if (tab === 'unread') {
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
    } else if (tab === 'all') {
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
    } else if (sectionKey === 'lists') {
      return (
        <FullscreenIllustration illustration="article-lists" style={{ height }}>
          Aucun article dans cette liste{'\n'}Ajoutez les grâce à l&apos;icone{' '}
          <Icon name="playlist-plus" size={20} />
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
    (sectionKey === 'categories' && reqState.list.loading) ||
    (sectionKey === 'quicks' && reqState.search?.loading)
  ) {
    return <ActivityIndicator color={colors.primary} size="large" />;
  } else if (
    (sectionKey === 'categories' && reqState.list.error) ||
    (sectionKey === 'quicks' && reqState.search?.error)
  ) {
    return <FullscreenIllustration illustration="article-greyed" style={{ height }} />;
  }
  return null;
};

export default ArticleEmptyList;
