import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Text, List, Button, Switch, useTheme } from 'react-native-paper';
import { View, Platform, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';

import { State, EventListItem, EventQuickItem, EventPrefs, Account, Preferences } from '@ts/types';
import {
  PlatformTouchable,
  Illustration,
  CustomHeaderBar,
  TranslucentStatusBar,
} from '@components/index';
import getStyles from '@styles/Styles';
import {
  deleteEventList,
  updateEventPrefs,
  deleteEventQuick,
  modifyEventList,
  addEventQuick,
} from '@redux/actions/contentData/events';
import getArticleStyles from '../styles/Styles';

import CreateModal from '../../components/CreateModal';
import EditModal from '../../components/EditModal';
import QuickTypeModal from '../../components/QuickTypeModal';
import QuickSelectModal from '../../components/QuickSelectModal';
import QuickLocationTypeModal from '../../components/QuickLocationTypeModal';

type EventListsProps = {
  lists: EventListItem[];
  quicks: EventQuickItem[];
  preferences: Preferences;
  eventPrefs: EventPrefs;
  account: Account;
  navigation: any;
};

type Category = {
  id: string;
  name: string;
  navigate: () => any;
  historyDisable?: boolean;
};

function EventLists({
  lists,
  quicks,
  preferences,
  eventPrefs,
  account,
  navigation,
}: EventListsProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [isCreateModalVisible, setCreateModalVisible] = React.useState(false);
  const [isEditModalVisible, setEditModalVisible] = React.useState(false);
  const [editingList, setEditingList] = React.useState(null);
  const [isQuickTypeModalVisible, setQuickTypeModalVisible] = React.useState(false);
  const [isQuickSelectModalVisible, setQuickSelectModalVisible] = React.useState(false);
  const [quickType, setQuickType] = React.useState('');
  const [isQuickLocationTypeModalVisible, setQuickLocationTypeModalVisible] = React.useState(false);

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
      name: 'Tous (dans le futur)',
      navigate: () =>
        navigation.push('Main', {
          screen: 'Home1',
          params: {
            screen: 'Home2',
            params: { screen: 'Event', params: { initialList: 'upcoming' } },
          },
        }),
      historyDisable: false,
    },
    {
      id: 'passed',
      name: 'Finis (dans le passé)',
      navigate: () =>
        navigation.push('Main', {
          screen: 'Home1',
          params: {
            screen: 'Home2',
            params: { screen: 'Event', params: { initialList: 'passed' } },
          },
        }),
      historyDisable: false,
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

  console.log(`Categories ${JSON.stringify(categories)}`);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Configurer',
              subtitle: 'Évènements',
            },
          },
        }}
      />
      <FlatList
        data={['categories', 'lists', 'tags']}
        keyExtractor={(s) => s}
        renderItem={({ item: section }) => {
          switch (section) {
            case 'categories':
              return (
                <View>
                  <DraggableFlatList
                    data={categories}
                    scrollPercent={5}
                    keyExtractor={(c) => c.id}
                    ItemSeparatorComponent={() => <Divider />}
                    ListHeaderComponent={() => (
                      <View>
                        <View style={styles.centerIllustrationContainer}>
                          <Illustration name="configure" height={200} width={200} />
                          <View style={[styles.contentContainer, { alignItems: 'center' }]}>
                            <Text>Choisissez les catégories et listes à afficher</Text>
                            <Text>Appuyez longtemps pour réorganiser</Text>
                          </View>
                        </View>
                        <List.Subheader>Catégories</List.Subheader>
                        <Divider />
                      </View>
                    )}
                    renderItem={({ item, move, moveEnd }) => {
                      const enabled = eventPrefs.categories.some((d) => d === item.id);
                      return (
                        <List.Item
                          key={item.id}
                          title={item.name}
                          description={
                            preferences.history || !item.historyDisable
                              ? null
                              : "Activez l'historique pour voir les évènements non lus"
                          }
                          left={() => <List.Icon />}
                          onPress={enabled ? item.navigate : () => null}
                          onLongPress={move}
                          disabled={!preferences.history && item.historyDisable}
                          titleStyle={
                            preferences.history || !item.historyDisable
                              ? {}
                              : { color: colors.disabled }
                          }
                          descriptionStyle={
                            preferences.history || !item.historyDisable
                              ? {}
                              : { color: colors.disabled }
                          }
                          right={() => (
                            <View style={{ flexDirection: 'row' }}>
                              <Switch
                                disabled={!preferences.history && item.historyDisable}
                                value={enabled && (preferences.history || !item.historyDisable)}
                                color={colors.primary}
                                onTouchEnd={
                                  enabled
                                    ? () =>
                                        updateEventPrefs({
                                          categories: eventPrefs.categories?.filter(
                                            (d) => d !== item.id,
                                          ),
                                        })
                                    : () =>
                                        updateEventPrefs({
                                          categories: [...(eventPrefs.categories || []), item.id],
                                        })
                                }
                              />
                            </View>
                          )}
                        />
                      );
                    }}
                    ListFooterComponent={() => <Divider />}
                    onMoveEnd={({ to, from }) => {
                      const tempCategories = eventPrefs.categories;
                      const buffer = eventPrefs.categories[to];
                      tempCategories[to] = eventPrefs.categories[from];
                      tempCategories[from] = buffer;
                      updateEventPrefs({ categories: tempCategories });
                    }}
                  />
                </View>
              );

            case 'lists':
              return (
                <DraggableFlatList
                  data={lists}
                  scrollPercent={5}
                  ListHeaderComponent={() => (
                    <View>
                      <View style={articleStyles.listSpacer} />
                      <List.Subheader>Listes</List.Subheader>
                      <View style={articleStyles.subheaderDescriptionContainer}>
                        <Text>
                          Ajoutez vos évènements à des listes afin de pouvoir y accéder rapidement.
                        </Text>
                        <Text>
                          Les évènements ajoutés seront disponibles hors-ligne
                          {account.loggedIn && preferences.syncLists
                            ? ' et seront sauvegardés sur votre compte.'
                            : '.'}
                        </Text>
                      </View>
                      <Divider />
                    </View>
                  )}
                  ItemSeparatorComponent={() => <Divider />}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, move }) => {
                    return (
                      <List.Item
                        title={item.name}
                        description={`${
                          item.items.length
                            ? `${item.items.length} événements${item.items.length === 1 ? '' : 's'}`
                            : 'Aucun événement'
                        }${item.description ? `\n${item.description}` : ''}`}
                        descriptionNumberOfLines={100}
                        onPress={() =>
                          navigation.push('Main', {
                            screen: 'Home1',
                            params: {
                              screen: 'Home2',
                              params: {
                                screen: 'Article',
                                params: { initialList: item.id },
                              },
                            },
                          })
                        }
                        onLongPress={move}
                        left={() => <List.Icon icon={item.icon} />}
                        right={() => (
                          <View style={{ flexDirection: 'row' }}>
                            <View onStartShouldSetResponder={() => true}>
                              <PlatformTouchable
                                onPress={() => {
                                  setEditingList(item);
                                  setEditModalVisible(true);
                                }}
                              >
                                <List.Icon icon="pencil" />
                              </PlatformTouchable>
                            </View>
                            <View onStartShouldSetResponder={() => true}>
                              <PlatformTouchable
                                disabled={lists.length === 1 && eventPrefs.categories?.length === 0}
                                onPress={() => {
                                  Alert.alert(
                                    `Voulez vous vraiment supprimer la liste ${item.name}?`,
                                    'Cette action est irréversible',
                                    [
                                      {
                                        text: 'Annuler',
                                        onPress: () => {},
                                      },
                                      {
                                        text: 'Supprimer',
                                        onPress: () => deleteEventList(item.id),
                                      },
                                    ],
                                    {
                                      cancelable: true,
                                    },
                                  );
                                }}
                              >
                                <List.Icon
                                  icon="delete"
                                  color={
                                    lists.length === 1 && eventPrefs.categories?.length === 0
                                      ? colors.disabled
                                      : colors.text
                                  }
                                />
                              </PlatformTouchable>
                            </View>
                          </View>
                        )}
                      />
                    );
                  }}
                  onMoveEnd={({ from, to }) => {
                    const fromList = lists[from];
                    const toList = lists[to];

                    modifyEventList(
                      fromList.id,
                      toList.name,
                      toList.icon,
                      toList.description,
                      toList.items,
                    );
                    modifyEventList(
                      toList.id,
                      fromList.name,
                      fromList.icon,
                      fromList.description,
                      fromList.items,
                    );
                  }}
                  ListFooterComponent={() => (
                    <View>
                      <Divider />
                      <View style={styles.container}>
                        <Button
                          mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
                          uppercase={Platform.OS !== 'ios'}
                          onPress={() => setCreateModalVisible(true)}
                        >
                          Créer
                        </Button>
                      </View>
                    </View>
                  )}
                />
              );

            case 'tags':
              return (
                <FlatList
                  data={quicks}
                  ListHeaderComponent={() => (
                    <View>
                      <View style={articleStyles.listSpacer} />

                      <List.Subheader>Tags et groupes</List.Subheader>

                      <View style={articleStyles.subheaderDescriptionContainer}>
                        <Text>
                          Choisissez des sujets et des groupes à afficher pour un accès rapide aux
                          événements qui vous intéressent
                        </Text>
                      </View>
                      <Divider />
                    </View>
                  )}
                  renderItem={({ item }) => {
                    let content = { description: 'Unk', icon: 'error' };
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
                    }
                    return (
                      <View>
                        <List.Item
                          title={item.title}
                          description={content.description}
                          left={() => <List.Icon icon={content.icon} />}
                          right={() => (
                            <View style={{ flexDirection: 'row' }}>
                              <PlatformTouchable
                                onPress={() => {
                                  deleteEventQuick(item.id);
                                }}
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

      <CreateModal
        visible={isCreateModalVisible}
        setVisible={setCreateModalVisible}
        type="events"
      />
      <EditModal
        visible={isEditModalVisible}
        setVisible={setEditModalVisible}
        editingList={editingList}
        setEditingList={setEditingList}
        type="events"
      />
      <QuickLocationTypeModal
        visible={isQuickLocationTypeModalVisible}
        setVisible={setQuickLocationTypeModalVisible}
        next={next}
      />
      <QuickTypeModal
        type="events"
        visible={isQuickTypeModalVisible}
        setVisible={setQuickTypeModalVisible}
        next={next}
      />
      <QuickSelectModal
        visible={isQuickSelectModalVisible}
        setVisible={setQuickSelectModalVisible}
        dataType={quickType}
        type="events"
      />
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { eventData, preferences, account } = state;
  return {
    lists: eventData.lists,
    quicks: eventData.quicks,
    eventPrefs: eventData.prefs,
    preferences,
    account,
  };
};

export default connect(mapStateToProps)(EventLists);

EventLists.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  state: PropTypes.shape({
    info: PropTypes.shape({}).isRequired,
  }).isRequired,
};
