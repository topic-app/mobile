import React from 'react';
import { View, Platform } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';

import { ArticleRequestState } from '@ts/types';
import { Illustration } from '@components/index';
import getStyles from '@styles/Styles';

import getArticleStyles from '../styles/Styles';

type ArticleEmptyListProps = {
  tab: string;
  sectionKey: string;
  reqState: ArticleRequestState;
  navigation: StackNavigationProp<any, any>;
};

const ArticleEmptyList: React.FC<ArticleEmptyListProps> = ({
  tab,
  sectionKey,
  reqState,
  navigation,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  console.log(`Key ${sectionKey}`);

  if (
    (sectionKey === 'categories' && reqState.list.success) ||
    (sectionKey === 'quicks' && reqState.search.success) ||
    sectionKey === 'lists'
  ) {
    if (tab === 'unread') {
      return (
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="article-completed" height={400} width={400} />
          <Text>Vous avez lu tous les articles !</Text>
        </View>
      );
    } else if (tab === 'all') {
      return (
        <View>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="article" height={400} width={400} />
            <Text>Aucun article pour cette localisation</Text>
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
          <Text>Aucun article dans cette liste</Text>
          <View style={styles.contentContainer}>
            <Text style={articleStyles.captionText}>
              Ajoutez les grâce à l&apos;icone <Icon name="playlist-plus" size={20} />
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="article" height={400} width={400} />
          <Text>Aucun article dans cette catégorie</Text>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.centerIllustrationContainer}>
        <Illustration name="article-greyed" height={400} width={400} />
      </View>
    );
  }
};

export default ArticleEmptyList;
