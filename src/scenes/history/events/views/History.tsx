import moment from 'moment';
import React from 'react';
import { View, FlatList } from 'react-native';
import { List, Text, Divider } from 'react-native-paper';
import { connect } from 'react-redux';

import { PlatformTouchable } from '@components/index';
import { deleteArticleRead } from '@redux/actions/contentData/articles';
import getStyles from '@styles/Styles';
import { EventReadItem, Preferences, State } from '@ts/types';
import { useTheme } from '@utils/index';

import { HistoryScreenNavigationProp } from '../../index';

type EventHistoryProps = {
  navigation: HistoryScreenNavigationProp<'Event'>;
  read: EventReadItem[];
  preferences: Preferences;
};

function EventHistory({ navigation, read, preferences }: EventHistoryProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!preferences.history) {
    return (
      <View style={styles.page}>
        <View style={styles.centerIllustrationContainer}>
          <Text>L&amp;historique est désactivé</Text>
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

const mapStateToProps = (state: State) => {
  const { eventData, preferences } = state;
  return {
    read: eventData.read,
    preferences,
  };
};

export default connect(mapStateToProps)(EventHistory);
