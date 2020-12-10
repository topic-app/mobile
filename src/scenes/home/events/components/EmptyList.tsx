import React from 'react';
import { View, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ArticleRequestState } from '@ts/types';
import { Illustration } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

import getArticleStyles from '../styles/Styles';

type ArticleEmptyListProps = {
  tab: string;
  sectionKey: string;
  reqState: ArticleRequestState;
  navigation: StackNavigationProp<any, any>;
  changeTab: (tabKey: string) => void;
};

const ArticleEmptyList: React.FC<ArticleEmptyListProps> = ({
  tab,
  sectionKey,
  reqState,
  navigation,
  changeTab,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  if (
    (sectionKey === 'categories' && reqState.list.success) ||
    (sectionKey === 'quicks' && reqState.search.success) ||
    sectionKey === 'lists'
  ) {
    if (tab === 'upcoming' || tab === 'passed') {
      return (
        <View>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="event" height={400} width={400} />
            <Text>Aucun évènement {tab === 'upcoming' && 'prévu '}pour cette localisation</Text>
          </View>
          <View style={styles.container}>
            <Button
              mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
              uppercase={Platform.OS !== 'ios'}
              onPress={() =>
                navigation.navigate('Main', {
                  screen: 'Params',
                  params: {
                    screen: 'Article',
                  },
                })
              }
            >
              Localisation
            </Button>
          </View>
        </View>
      );
    } else if (sectionKey === 'lists') {
      return (
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="article-lists" height={400} width={400} />
          <Text>Aucun évènement dans cette liste</Text>
          <View style={styles.contentContainer}>
            <Text style={articleStyles.captionText}>
              Ajoutez les grâce à l&apos;icône <Icon name="playlist-plus" size={20} />
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="event" height={400} width={400} />
          <Text>Aucun évènement dans cette catégorie</Text>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.centerIllustrationContainer}>
        <Illustration name="event-greyed" height={400} width={400} />
      </View>
    );
  }
};

export default ArticleEmptyList;
