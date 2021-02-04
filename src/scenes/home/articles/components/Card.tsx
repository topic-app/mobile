import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ArticleCard, PlatformTouchable } from '@components/index';
import {
  addArticleRead,
  deleteArticleRead,
  addArticleToList,
  removeArticleFromList,
} from '@redux/actions/contentData/articles';
import getStyles from '@styles/Styles';
import { ArticleListItem, Article, ArticlePreload } from '@ts/types';
import { useTheme, Alert } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type ArticleListCardProps = {
  article: ArticlePreload | Article;
  group?: string;
  sectionKey: string;
  setAddToListModalArticle: (id: string) => void;
  setAddToListModalVisible: (val: boolean) => void;
  isRead: boolean;
  historyActive: boolean;
  lists: ArticleListItem[];
  navigate: () => void;
  overrideImageWidth: number;
};

const ArticleListCard: React.FC<ArticleListCardProps> = ({
  article,
  group,
  sectionKey,
  isRead,
  historyActive,
  setAddToListModalArticle,
  setAddToListModalVisible,
  lists,
  navigate,
  overrideImageWidth,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const swipeRef = React.createRef<Swipeable>();

  const maxLeftActions = (Dimensions.get('window').width - (100 + 120 * 2)) / 120;

  if (Platform.OS === 'web') {
    return (
      <ArticleCard
        unread={!isRead || sectionKey !== 'all'}
        article={article}
        navigate={navigate}
        overrideImageWidth={overrideImageWidth}
      />
    );
  }

  const renderLeftActions = (
    id: string,
    title: string,
    swipePropRef: React.RefObject<Swipeable>,
  ) => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        ]}
      >
        {group !== 'lists' ? (
          <View key="read" style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                if (isRead) deleteArticleRead(id);
                else addArticleRead(id, title, true);
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon name={isRead ? 'eye-off' : 'eye'} color={colors.disabled} size={32} />
                <Text style={{ color: colors.disabled, textAlign: 'center' }}>
                  Marquer {isRead ? 'non lu' : 'lu'}
                </Text>
              </View>
            </PlatformTouchable>
          </View>
        ) : (
          <View key="delete" style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                removeArticleFromList(id, sectionKey);
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon name="delete" color={colors.disabled} size={32} />
                <Text style={{ color: colors.disabled, textAlign: 'center' }}>Retirer</Text>
              </View>
            </PlatformTouchable>
          </View>
        )}
        <View key="add" style={{ width: 120 }}>
          <PlatformTouchable
            onPress={() => {
              setAddToListModalArticle(id);
              setAddToListModalVisible(true);
            }}
          >
            <View style={{ alignItems: 'center', margin: 10 }}>
              <Icon name="playlist-plus" color={colors.disabled} size={32} />
              <Text style={{ color: colors.disabled, textAlign: 'center' }}>Sauvegarder</Text>
            </View>
          </PlatformTouchable>
        </View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => renderLeftActions(article._id, article.title, swipeRef)}
      // renderRightActions={
      //  historyActive || group !== 'lists' ? () => renderRightActions(article._id) : undefined
      // }
      // onSwipeableRightOpen={
      //   historyActive || group !== 'lists'
      //     ? () => swipeRightAction(article._id, article.title, swipeRef)
      //     : undefined
      // }
    >
      <ArticleCard
        unread={!isRead || sectionKey !== 'all'}
        article={article}
        navigate={navigate}
        overrideImageWidth={overrideImageWidth}
      />
    </Swipeable>
  );
};

export default ArticleListCard;
