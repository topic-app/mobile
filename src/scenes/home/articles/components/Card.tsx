import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ArticleCard, PlatformTouchable } from '@components';
import { addArticleRead, deleteArticleReadAll } from '@redux/actions/contentData/articles';
import { Article, ArticlePreload } from '@ts/types';
import { Alert } from '@utils';

import getStyles from './styles';

type ArticleListCardProps = {
  article: ArticlePreload | Article;
  sectionKey: string;
  isRead: boolean;
  historyActive: boolean;
  navigate: () => void;
  overrideImageWidth?: number;
};

const ArticleListCard: React.FC<ArticleListCardProps> = ({
  article,
  sectionKey,
  isRead,
  historyActive,
  navigate,
  overrideImageWidth,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const swipeRef = React.createRef<Swipeable>();

  if (Platform.OS === 'web') {
    return (
      <ArticleCard
        unread={!isRead}
        article={article}
        navigate={navigate}
        overrideImageWidth={overrideImageWidth}
      />
    );
  }

  const renderLeftActions = () => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1 },
        ]}
      >
        <Icon
          name={isRead ? 'eye-off' : 'eye'}
          color={colors.disabled}
          size={32}
          style={{ marginHorizontal: 10 }}
        />
        <Text style={{ color: colors.disabled, textAlign: 'center' }}>
          Marquer {isRead ? 'non lu' : 'lu'}
        </Text>
      </View>
    );
  };

  return historyActive ? (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={renderLeftActions}
      onSwipeableLeftOpen={() => {
        if (isRead) deleteArticleReadAll(article._id);
        else addArticleRead(article._id, article.title, true);
      }}
      overshootLeft
    >
      <ArticleCard
        unread={!isRead || sectionKey !== 'all'}
        article={article}
        navigate={navigate}
        overrideImageWidth={overrideImageWidth}
      />
    </Swipeable>
  ) : (
    <ArticleCard
      unread={!isRead || sectionKey !== 'all'}
      article={article}
      navigate={navigate}
      overrideImageWidth={overrideImageWidth}
    />
  );
};

export default ArticleListCard;
