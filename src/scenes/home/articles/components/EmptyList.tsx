import React from 'react';
import { useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FullscreenIllustration } from '@components/index';
import { ArticleRequestState } from '@ts/types';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';

type ArticleEmptyListProps = {
  tab: string;
  sectionKey: string;
  reqState: ArticleRequestState;
  navigation: HomeTwoScreenNavigationProp<'Article'>;
  changeTab: (tabKey: string) => void;
};

const ArticleEmptyList: React.FC<ArticleEmptyListProps> = ({
  tab,
  sectionKey,
  reqState,
  navigation,
  changeTab,
}) => {
  const height = useWindowDimensions().height - 300;
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
  } else {
    return <FullscreenIllustration illustration="article-greyed" style={{ height }} />;
  }
};

export default ArticleEmptyList;
