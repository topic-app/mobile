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
  lists,
  navigate,
  overrideImageWidth,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const swipeRef = React.createRef<Swipeable>();

  const maxLeftActions = (Dimensions.get('window').width - 100) / 120;

  const renderRightActions = (_id: string) => {
    return (
      <View style={[styles.centerIllustrationContainer, { width: '100%', alignItems: 'flex-end' }]}>
        {group !== 'lists' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Text style={articleStyles.captionText}>Marquer comme {isRead ? 'non lu' : 'lu'}</Text>
            <Icon
              name={isRead ? 'eye-off' : 'eye'}
              size={32}
              style={{ marginHorizontal: 10 }}
              color={colors.disabled}
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Text style={articleStyles.captionText}>Retirer</Text>
            <Icon
              name="delete"
              color={colors.disabled}
              size={32}
              style={{ marginHorizontal: 10 }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderLeftActions = (id: string, swipePropRef: React.RefObject<Swipeable>) => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        ]}
      >
        {lists.slice(0, maxLeftActions).map((l) => (
          <View key={l.id} style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                if (l.items.some((i) => i._id === id)) {
                  Alert.alert(
                    `Retirer l'article de la liste ${l.name} ?`,
                    "L'article ne sera plus disponible hors-ligne",
                    [
                      { text: 'Annuler' },
                      {
                        text: 'Retirer',
                        onPress: () => removeArticleFromList(id, l.id),
                      },
                    ],
                    { cancelable: true },
                  );
                } else {
                  addArticleToList(id, l.id);
                }
                swipePropRef.current?.close();
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon
                  name={l.icon || 'playlist-plus'}
                  size={32}
                  color={l.items.some((i) => i._id === id) ? colors.primary : colors.disabled}
                />
                <Text
                  style={{
                    color: l.items.some((i) => i._id === id) ? colors.primary : colors.disabled,
                  }}
                >
                  {l.name}
                </Text>
              </View>
            </PlatformTouchable>
          </View>
        ))}
      </View>
    );
  };

  const swipeRightAction = (
    id: string,
    title: string,
    swipePropRef: React.RefObject<Swipeable>,
  ) => {
    swipePropRef.current?.close();
    if (group === 'lists') {
      removeArticleFromList(id, sectionKey);
    } else {
      if (isRead) deleteArticleRead(id);
      else addArticleRead(id, title, true);
    }
  };

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

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => renderLeftActions(article._id, swipeRef)}
      renderRightActions={
        historyActive || group !== 'lists' ? () => renderRightActions(article._id) : undefined
      }
      onSwipeableRightOpen={
        historyActive || group !== 'lists'
          ? () => swipeRightAction(article._id, article.title, swipeRef)
          : undefined
      }
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
