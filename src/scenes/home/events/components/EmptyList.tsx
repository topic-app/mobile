import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FullscreenIllustration } from '@components';
import { EventRequestState } from '@ts/types';
import { useTheme } from '@utils';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';

type EventEmptyListProps = {
  sectionKey: string;
  group?: string;
  reqState: EventRequestState;
  changeTab: (tabKey: string) => void;
};

const EventEmptyList: React.FC<EventEmptyListProps> = ({
  sectionKey,
  group,
  reqState,
  changeTab,
}) => {
  const height = useWindowDimensions().height - 300;
  const navigation = useNavigation<HomeTwoScreenNavigationProp<'Event'>>();

  const theme = useTheme();
  const { colors } = theme;

  if (
    (group === 'categories' && reqState.list.success) ||
    (group === 'quicks' && reqState.search?.success) ||
    group === 'lists'
  ) {
    if (sectionKey === 'passed') {
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
          Aucun évènement pour cette localisation
        </FullscreenIllustration>
      );
    } else if (sectionKey === 'upcoming') {
      return (
        <FullscreenIllustration
          style={{ height }}
          illustration="event"
          buttonLabel="Évènements finis"
          buttonOnPress={() => changeTab('passed')}
        >
          Aucun évènement prévu
        </FullscreenIllustration>
      );
    } else if (sectionKey === 'following') {
      return (
        <FullscreenIllustration illustration="event" style={{ height }}>
          Vous verrez içi les évènements des groupes et utilisateurs que vous suivez
        </FullscreenIllustration>
      );
    } else if (group === 'lists') {
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
  } else if (
    (group === 'categories' && reqState.list.loading) ||
    (group === 'quicks' && reqState.search?.loading)
  ) {
    return <ActivityIndicator color={colors.primary} size="large" />;
  } else if (
    (group === 'categories' && reqState.list.error) ||
    (group === 'quicks' && reqState.search?.error)
  ) {
    return <FullscreenIllustration illustration="event-greyed" style={{ height }} />;
  }
  return null;
};

export default EventEmptyList;
