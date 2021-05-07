import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ArticleCard, PlatformTouchable } from '@components';
import {
  addArticleRead,
  addArticleToList,
  deleteArticleReadAll,
  removeArticleFromList,
} from '@redux/actions/contentData/articles';
import { ArticleListItem, Article, ArticlePreload } from '@ts/types';
import { Alert } from '@utils';

import getStyles from './styles';

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

  const renderLeftActions = (id: string, title: string) => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        ]}
      >
        {group !== 'lists' ? (
          historyActive ? (
            <View key="read" style={{ width: 120 }}>
              <PlatformTouchable
                onPress={() => {
                  if (isRead) deleteArticleReadAll(id);
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
          ) : null
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
        {lists.length === 1 && group !== 'lists' ? (
          <View key="firstlist" style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                if (lists[0].items.some((i) => i._id === article._id)) {
                  Alert.alert(
                    'Voulez vous vraiment retirer cet article de la liste ?',
                    article.title,
                    [
                      { text: 'Annuler' },
                      {
                        text: 'Retirer',
                        onPress: () => removeArticleFromList(article._id, lists[0].id),
                      },
                    ],
                    { cancelable: true },
                  );
                } else {
                  addArticleToList(article._id, lists[0].id);
                }
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon
                  name={lists[0].icon}
                  color={
                    lists[0].items.some((i) => i._id === article._id)
                      ? colors.primary
                      : colors.disabled
                  }
                  size={32}
                />
                <Text
                  style={{
                    color: lists[0].items.some((i) => i._id === article._id)
                      ? colors.primary
                      : colors.disabled,
                    textAlign: 'center',
                  }}
                >
                  {lists[0].name}
                </Text>
              </View>
            </PlatformTouchable>
          </View>
        ) : (
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
        )}
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => renderLeftActions(article._id, article.title)}
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
