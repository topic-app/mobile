import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FullscreenIllustration } from '@components/index';
import getStyles from '@styles/Styles';
import { ArticleRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type EventEmptyListProps = {
  tab: string;
  sectionKey: string;
  reqState: ArticleRequestState;
  navigation: StackNavigationProp<any, any>;
  changeTab: (tabKey: string) => void;
};

const EventEmptyList: React.FC<EventEmptyListProps> = ({
  tab,
  sectionKey,
  reqState,
  navigation,
  changeTab,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const height = useWindowDimensions().height - 300;

  if (
    (sectionKey === 'categories' && reqState.list.success) ||
    (sectionKey === 'quicks' && reqState.search.success) ||
    sectionKey === 'lists'
  ) {
    if (tab === 'upcoming' || tab === 'passed') {
      return (
        <FullscreenIllustration
          style={{ height }}
          illustration="event"
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
          Aucun événement {tab === 'upcoming' && 'prévu '}pour cette localisation
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
        <FullscreenIllustration illustration="event" style={{ height }}>
          Aucun article dans cette catégorie
        </FullscreenIllustration>
      );
    }
  } else {
    return <FullscreenIllustration illustration="event-greyed" style={{ height }} />;
  }
};

export default EventEmptyList;
