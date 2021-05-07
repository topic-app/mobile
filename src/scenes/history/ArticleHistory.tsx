import moment from 'moment';
import React from 'react';
import { View, FlatList } from 'react-native';
import { List, Text, Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { PlatformTouchable, PageContainer } from '@components';
import { deleteArticleRead } from '@redux/actions/contentData/articles';
import getStyles from '@styles/global';
import { ArticleReadItem, Preferences, State } from '@ts/types';

import type { HistoryScreenNavigationProp } from '.';

type ArticleHistoryProps = {
  navigation: HistoryScreenNavigationProp<'Article'>;
  read: ArticleReadItem[];
  preferences: Preferences;
};

const ArticleHistory: React.FC<ArticleHistoryProps> = ({ navigation, read, preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!preferences.history) {
    return (
      <View style={styles.page}>
        <View style={styles.centerIllustrationContainer}>
          <Text>L&apos;historique est désactivé</Text>
        </View>
      </View>
    );
  }

  return (
    <PageContainer headerOptions={{ title: 'Historique', subtitle: 'Articles' }}>
      <FlatList
        data={read.sort((a, b) => (a.date?.valueOf() || 0) - (b.date?.valueOf() || 0))}
        keyExtractor={(i) => i.key}
        renderItem={({ item }) => (
          <List.Item
            title={item.title || 'Article inconnu'}
            description={
              item.date
                ? `Article · ${item.marked ? 'Marqué comme lu' : 'Lu'} le ${moment(
                    item.date,
                  ).format('dddd DD MMMM')} à ${moment(item.date).format('hh:mm')}`
                : 'Date inconnue'
            }
            right={() => (
              <View onStartShouldSetResponder={() => true}>
                <PlatformTouchable onPress={() => deleteArticleRead(item.key)}>
                  <List.Icon icon="delete" />
                </PlatformTouchable>
              </View>
            )}
            onPress={() =>
              navigation.navigate('Root', {
                screen: 'Main',
                params: {
                  screen: 'Display',
                  params: {
                    screen: 'Article',
                    params: {
                      screen: 'Display',
                      params: {
                        id: item.id,
                        title: item.title,
                        useLists: false,
                      },
                    },
                  },
                },
              })
            }
          />
        )}
        ListEmptyComponent={() => (
          <View style={[styles.centerIllustrationContainer, styles.container]}>
            <Text>Aucun élément</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { articleData, preferences } = state;
  return {
    read: articleData.read,
    preferences,
  };
};

export default connect(mapStateToProps)(ArticleHistory);
