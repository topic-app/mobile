import React from 'react';
import { useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FullscreenIllustration } from '@components/index';
import { ArticleRequestState } from '@ts/types';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';

type EventEmptyListProps = {
  tab: string;
  sectionKey: string;
  reqState: ArticleRequestState;
  navigation: HomeTwoScreenNavigationProp<'Event'>;
  changeTab: (tabKey: string) => void;
};

const EventEmptyList: React.FC<EventEmptyListProps> = ({
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
          Aucun évènement {tab === 'upcoming' && 'prévu '} pour cette localisation
        </FullscreenIllustration>
      );
    } else if (sectionKey === 'lists') {
      return (
        <FullscreenIllustration illustration="article-lists" style={{ height }}>
          Aucun évènement dans cette liste{'\n'}Ajoutez les grâce à l&apos;icône{' '}
          <Icon name="playlist-plus" size={20} />
        </FullscreenIllustration>
      );
    } else {
      return (
        <FullscreenIllustration illustration="event" style={{ height }}>
          Aucun évènement dans cette catégorie
        </FullscreenIllustration>
      );
    }
  } else {
    return <FullscreenIllustration illustration="event-greyed" style={{ height }} />;
  }
};

export default EventEmptyList;
