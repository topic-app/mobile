import React from 'react';
import { View, Platform, FlatList } from 'react-native';
// @ts-expect-error Replace this when we find a better library
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';
import { Divider, Text, List, Button, Switch, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { PlatformTouchable, Illustration, PageContainer } from '@components';
import {
  updateEventPrefs,
  addEventQuick,
  deleteEventQuick,
  reorderEventQuick,
} from '@redux/actions/contentData/events';
import { State, Account, Preferences, EventQuickItem, EventPrefs } from '@ts/types';
import { Alert } from '@utils';

import type { EventConfigureScreenNavigationProp } from '.';
import QuickLocationTypeModal from '../components/QuickLocationTypeModal';
import QuickSelectModal from '../components/QuickSelectModal';
import QuickTypeModal from '../components/QuickTypeModal';
import getStyles from './styles';

type EventConfigureProps = {
  quicks: EventQuickItem[];
  preferences: Preferences;
  eventPrefs: EventPrefs;
  account: Account;
  navigation: EventConfigureScreenNavigationProp<'Configure'>;
};

type Category = {
  id: string;
  name: string;
  navigate: () => any;
  disable?: boolean;
  disableReason?: string;
};

function EventConfigure({
  quicks,
  preferences,
  eventPrefs,
  account,
  navigation,
}: EventConfigureProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [isQuickTypeModalVisible, setQuickTypeModalVisible] = React.useState(false);
  const [isQuickSelectModalVisible, setQuickSelectModalVisible] = React.useState(false);
  const [isQuickLocationTypeModalVisible, setQuickLocationTypeModalVisible] = React.useState(false);
  const [quickType, setQuickType] = React.useState('');

  const next = (data: string) => {
    if (data === 'location') {
      setQuickLocationTypeModalVisible(true);
      setQuickTypeModalVisible(false);
    } else if (data === 'global') {
      addEventQuick('global', 'global', 'France');
      setQuickLocationTypeModalVisible(false);
    } else {
      setQuickType(data);
      setQuickTypeModalVisible(false);
      setQuickLocationTypeModalVisible(false);
      setQuickSelectModalVisible(true);
    }
  };

  const categoryTypes: Category[] = [
    {
      id: 'upcoming',
      name: '?? venir (dans le futur)',
      navigate: () =>
        navigation.push('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: {
              screen: 'Home2',
              params: { screen: 'Event', params: { initialList: 'upcoming' } },
            },
          },
        }),
    },
    {
      id: 'passed',
      name: 'Finis (dans le pass??)',
      navigate: () =>
        navigation.push('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: {
              screen: 'Home2',
              params: { screen: 'Event', params: { initialList: 'passed' } },
            },
          },
        }),
    },
    {
      id: 'following',
      name: 'Suivis',
      navigate: () =>
        navigation.push('Root', {
          screen: 'Main',
          params: {
            screen: 'Home2',
            params: { screen: 'Event', params: { initialList: 'following' } },
          },
        }),
      disable: !account.loggedIn,
      disableReason: 'Indisponible - non connect??',
    },
  ];

  let categories: Category[] = [];

  categoryTypes.forEach((c, i) => {
    if (eventPrefs.categories?.includes(c.id)) {
      categories[eventPrefs.categories?.indexOf(c.id)] = c;
    }
  });

  categories = [
    ...categories,
    ...categoryTypes.filter((c) => !eventPrefs.categories?.includes(c.id)),
  ];

  return (
    <PageContainer headerOptions={{ title: 'Configurer', subtitle: '??v??nements' }}>
      <FlatList
        data={['categories', 'tags']}
        keyExtractor={(s) => s}
        renderItem={({ item: section }) => {
          switch (section) {
            case 'categories':
              return (
                <View>
                  <DraggableFlatList
                    data={categories}
                    scrollPercent={5}
                    keyExtractor={(c: Category) => c.id}
                    ItemSeparatorComponent={() => <Divider />}
                    ListHeaderComponent={() => (
                      <View>
                        <View style={styles.centerIllustrationContainer}>
                          <Illustration name="configure" height={200} width={200} />
                          <View style={[styles.contentContainer, { alignItems: 'center' }]}>
                            <Text>Choisissez les cat??gories et listes ?? afficher</Text>
                            <Text>Appuyez longtemps pour r??organiser</Text>
                          </View>
                        </View>
                        <List.Subheader>Cat??gories</List.Subheader>
                        <Divider />
                      </View>
                    )}
                    renderItem={({
                      item,
                      move,
                      moveEnd,
                    }: {
                      item: Category;
                      move: () => any;
                      moveEnd: () => any;
                    }) => {
                      const enabled = eventPrefs.categories?.some((d) => d === item.id);
                      return (
                        <List.Item
                          key={item.id}
                          title={item.name}
                          description={item.disable ? item.disableReason : null}
                          left={() => <View style={{ width: 56, height: 56 }} />}
                          onPress={() => {}}
                          onLongPress={move}
                          titleStyle={!item.disable ? {} : { color: colors.disabled }}
                          descriptionStyle={!item.disable ? {} : { color: colors.disabled }}
                          right={() => (
                            <View style={{ flexDirection: 'row' }}>
                              <Switch
                                disabled={item.disable}
                                value={enabled && !item.disable}
                                accessibilityLabel={item.name}
                                color={colors.primary}
                                onValueChange={(val) =>
                                  val
                                    ? updateEventPrefs({
                                        categories: [...(eventPrefs.categories || []), item.id],
                                      })
                                    : updateEventPrefs({
                                        categories: eventPrefs.categories?.filter(
                                          (d) => d !== item.id,
                                        ),
                                      })
                                }
                              />
                            </View>
                          )}
                        />
                      );
                    }}
                    ListFooterComponent={() => <Divider />}
                    onMoveEnd={({ to, from }: { to: number; from: number }) => {
                      const tempCategories = eventPrefs.categories;
                      if (eventPrefs.categories && tempCategories) {
                        const buffer = eventPrefs.categories[to];
                        tempCategories[to] = eventPrefs.categories[from];
                        tempCategories[from] = buffer;
                      }
                      updateEventPrefs({ categories: tempCategories });
                    }}
                  />
                </View>
              );

            case 'tags':
              return (
                <DraggableFlatList
                  data={quicks}
                  ListHeaderComponent={() => (
                    <View>
                      <View style={styles.listSpacer} />

                      <List.Subheader>Tags et groupes</List.Subheader>

                      <View style={styles.subheaderDescriptionContainer}>
                        <Text>
                          Choisissez des sujets et des groupes ?? afficher pour un acc??s rapide aux
                          ??v??nements qui vous int??ressent
                        </Text>
                      </View>
                      <Divider />
                    </View>
                  )}
                  renderItem={({ item, move }: { item: EventQuickItem; move: () => any }) => {
                    let content = { description: 'Erreur', icon: 'alert-decagram' };
                    if (item.type === 'tag') {
                      content = {
                        description: 'Tag',
                        icon: 'pound',
                      };
                    } else if (item.type === 'group') {
                      content = {
                        description: 'Groupe',
                        icon: 'account-group',
                      };
                    } else if (item.type === 'user') {
                      content = {
                        description: 'Utilisateur',
                        icon: 'account',
                      };
                    } else if (item.type === 'school') {
                      content = {
                        description: '??cole',
                        icon: 'school',
                      };
                    } else if (item.type === 'departement') {
                      content = {
                        description: 'D??partement',
                        icon: 'map-marker-radius',
                      };
                    } else if (item.type === 'region') {
                      content = { description: 'R??gion', icon: 'map-marker-radius' };
                    } else if (item.type === 'global') {
                      content = {
                        description: 'Localisation',
                        icon: 'flag',
                      };
                    }
                    return (
                      <View>
                        <List.Item
                          title={item.title}
                          onPress={() => {}}
                          onLongPress={move}
                          description={content.description}
                          left={() => <List.Icon icon={content.icon} />}
                          right={() => (
                            <View style={{ flexDirection: 'row' }}>
                              <PlatformTouchable
                                onPress={() => {
                                  deleteEventQuick(item.id);
                                }}
                                accessibilityLabel="Supprimer"
                              >
                                <List.Icon icon="delete" />
                              </PlatformTouchable>
                            </View>
                          )}
                        />
                        <Divider />
                      </View>
                    );
                  }}
                  onMoveEnd={({ from, to }: { from: number; to: number }) => {
                    const fromQuick = quicks[from];
                    const toQuick = quicks[to];

                    reorderEventQuick(fromQuick.id, toQuick.id);
                  }}
                  ListFooterComponent={() => (
                    <View style={styles.container}>
                      <Button
                        mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
                        uppercase={Platform.OS !== 'ios'}
                        onPress={() => {
                          setQuickTypeModalVisible(true);
                        }}
                      >
                        Ajouter
                      </Button>
                    </View>
                  )}
                />
              );

            default:
              return null;
          }
        }}
      />

      <QuickTypeModal
        type="events"
        visible={isQuickTypeModalVisible}
        setVisible={setQuickTypeModalVisible}
        next={next}
      />
      <QuickLocationTypeModal
        visible={isQuickLocationTypeModalVisible}
        setVisible={setQuickLocationTypeModalVisible}
        next={next}
      />
      <QuickSelectModal
        visible={isQuickSelectModalVisible}
        setVisible={setQuickSelectModalVisible}
        dataType={quickType}
        type="events"
      />
    </PageContainer>
  );
}

const mapStateToProps = (state: State) => {
  const { eventData, preferences, account } = state;
  return {
    quicks: eventData.quicks,
    eventPrefs: eventData.prefs,
    preferences,
    account,
  };
};

export default connect(mapStateToProps)(EventConfigure);
