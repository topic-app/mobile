import React from 'react';
import PropTypes from 'prop-types';
import { List, Text, Divider, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { ArticleReadItem, Preferences } from '@ts/types';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ErrorMessage, InlineCard, PlatformTouchable } from '@components/index';
import getStyles from '@styles/Styles';
import { deleteArticleRead } from '@redux/actions/contentData/articles';

type EventHistoryProps = {
  navigation: any;
  read: ArticleReadItem[];
  preferences: Preferences;
};

function EventHistory({ navigation, read, preferences }: EventHistoryProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!preferences.history) {
    return (
      <View style={styles.page}>
        <View style={styles.centerIllustrationContainer}>
          <Text>L'historique est désactivé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={read.reverse()}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title || 'Article inconnu'}
            description={
              `Article · ${item.marked ? 'Marqué comme lu' : 'Lu'} le ${moment(item.date).format(
                'dddd DD MMMM',
              )} à ${moment(item.date).format('hh:mm')}` || 'Date inconnue'
            }
            right={() => (
              <View onStartShouldSetResponder={() => true}>
                <PlatformTouchable onPress={() => deleteArticleRead(item.id)}>
                  <List.Icon icon="delete" />
                </PlatformTouchable>
              </View>
            )}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'Display',
                params: {
                  screen: 'Event',
                  params: {
                    screen: 'Display',
                    params: {
                      id: item.id,
                      title: item.title,
                      useLists: false,
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
    </View>
  );
}

const mapStateToProps = (state) => {
  const { eventData, preferences } = state;
  return {
    read: eventData.read,
    preferences,
  };
};

export default connect(mapStateToProps)(EventHistory);
