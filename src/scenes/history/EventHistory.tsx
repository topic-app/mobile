import moment from 'moment';
import React from 'react';
import { View, FlatList } from 'react-native';
import { List, Text, Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { PlatformTouchable, CustomHeaderBar, TranslucentStatusBar } from '@components';
import { deleteArticleRead } from '@redux/actions/contentData/articles';
import getStyles from '@styles/global';
import { EventReadItem, Preferences, State } from '@ts/types';

import { HistoryScreenNavigationProp } from '.';

type EventHistoryProps = {
  navigation: HistoryScreenNavigationProp<'Event'>;
  read: EventReadItem[];
  preferences: Preferences;
};

const EventHistory: React.FC<EventHistoryProps> = ({ navigation, read, preferences }) => {
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
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Historique',
              subtitle: 'Évènements',
            },
          },
        }}
      />
      <FlatList
        data={read.reverse()}
        // TODO: EventReadItem ids need to be individually distinct from eachother
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
              navigation.navigate('Root', {
                screen: 'Main',
                params: {
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
};

const mapStateToProps = (state: State) => {
  const { eventData, preferences } = state;
  return {
    read: eventData.read,
    preferences,
  };
};

export default connect(mapStateToProps)(EventHistory);
