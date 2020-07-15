import React from 'react';
import PropTypes from 'prop-types';
import {
  ProgressBar,
  Divider,
  Text,
  List,
  Button,
  HelperText,
  Card,
  TextInput as PaperTextInput,
  Switch,
  useTheme,
} from 'react-native-paper';
import { View, Platform, FlatList, Alert, TextInput } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import { State } from '@ts/types';
import {
  ErrorMessage,
  PlatformTouchable,
  PlatformIconButton,
  CollapsibleView,
  Illustration,
} from '@components/index';
import getStyles from '@styles/Styles';
import {
  deleteArticleList,
  addArticleList,
  modifyArticleList,
  updateArticlePrefs,
} from '@redux/actions/contentData/articles';
import getArticleStyles from '../styles/Styles';

function ArticleLists({ lists, preferences, articlePrefs, account, navigation }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [createListText, setCreateListText] = React.useState('');
  const [isCreateModalVisible, setCreateModalVisible] = React.useState(false);
  const [errorVisible, setErrorVisible] = React.useState(false);

  const [editListText, setEditListText] = React.useState('');
  const [editListDescription, setEditListDescription] = React.useState('');
  const [isEditModalVisible, setEditModalVisible] = React.useState(false);
  const [editingList, setEditingList] = React.useState(null);

  const categories = [
    {
      id: 'unread',
      name: 'Non lus',
      navigate: () =>
        navigation.push('Main', {
          screen: 'Home1',
          params: {
            screen: 'Home2',
            params: { screen: 'Article', params: { initialList: 'unread' } },
          },
        }),
      historyDisable: true,
    },
    {
      id: 'all',
      name: 'Tous',
      navigate: () =>
        navigation.push('Main', {
          screen: 'Home1',
          params: {
            screen: 'Home2',
            params: { screen: 'Article', params: { initialList: 'all' } },
          },
        }),
      historyDisable: false,
    },
  ];

  return (
    <View style={styles.page}>
      <FlatList
        data={lists}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article-lists" height={200} width={200} />
              <View style={styles.contentContainer}>
                <Text>Ajoutez vos articles à des listes afin de les retrouver facilement.</Text>
                <Text>
                  Les articles ajoutés seront disponibles hors-ligne
                  {account.loggedIn && preferences.syncLists
                    ? ' et seront sauvegardés sur votre compte.'
                    : '.'}
                </Text>
              </View>
            </View>
            <Divider />
            {categories.map((c) => (
              <View key={c.id}>
                <List.Item
                  title={c.name}
                  description={
                    preferences.history || !c.historyDisable
                      ? null
                      : "Activez l'historique pour voir les articles non lus"
                  }
                  left={() => <List.Icon />}
                  onPress={articlePrefs.hidden.includes(c.id) ? null : c.navigate}
                  disabled={!preferences.history && c.historyDisable}
                  titleStyle={
                    preferences.history || !c.historyDisable ? {} : { color: colors.disabled }
                  }
                  descriptionStyle={
                    preferences.history || !c.historyDisable ? {} : { color: colors.disabled }
                  }
                  right={() => (
                    <View style={{ flexDirection: 'row' }}>
                      <Switch
                        disabled={
                          (!preferences.history && c.historyDisable) ||
                          (articlePrefs.hidden.length >= categories.length - 1 &&
                            lists.length === 0 &&
                            !articlePrefs.hidden.includes(c.id))
                        }
                        value={
                          !articlePrefs.hidden.includes(c.id) &&
                          (preferences.history || !c.historyDisable)
                        }
                        color={colors.primary}
                        onTouchEnd={
                          articlePrefs.hidden.includes(c.id)
                            ? () =>
                                updateArticlePrefs({
                                  hidden: articlePrefs.hidden.filter((h) => h !== c.id),
                                })
                            : () => updateArticlePrefs({ hidden: [...articlePrefs.hidden, c.id] })
                        }
                      />
                    </View>
                  )}
                />
                <Divider />
              </View>
            ))}
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => {
          return (
            <List.Item
              title={item.name}
              description={`${
                item.items.length
                  ? `${item.items.length} article${item.items.length === 1 ? '' : 's'}`
                  : 'Aucun article'
              }${item.description ? `\n${item.description}` : ''}`}
              descriptionNumberOfLines={100}
              left={() => (
                <PlatformTouchable
                  onPress={() =>
                    navigation.push('Main', {
                      screen: 'Home1',
                      params: {
                        screen: 'Home2',
                        params: { screen: 'Article', params: { initialList: item.id } },
                      },
                    })
                  }
                >
                  <List.Icon icon={item.icon} />
                </PlatformTouchable>
              )}
              right={() => (
                <View style={{ flexDirection: 'row' }}>
                  <PlatformTouchable
                    onPress={() => {
                      setEditListText(item.name);
                      setEditListDescription(item.description);
                      setEditingList(item.id);
                      setEditModalVisible(true);
                    }}
                  >
                    <List.Icon icon="pencil" />
                  </PlatformTouchable>
                  <PlatformTouchable
                    disabled={
                      lists.length === 1 && articlePrefs.hidden.length > categories.length - 1
                    }
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
                            onPress: () => deleteArticleList(item.id),
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
                        lists.length === 1 && articlePrefs.hidden.length > categories.length - 1
                          ? colors.disabled
                          : colors.text
                      }
                    />
                  </PlatformTouchable>
                </View>
              )}
            />
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

      <Modal
        isVisible={isCreateModalVisible}
        avoidKeyboard
        onBackdropPress={() => setCreateModalVisible(false)}
        onBackButtonPress={() => setCreateModalVisible(false)}
        onSwipeComplete={() => setCreateModalVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <Card>
          <View>
            <Divider />

            <View style={articleStyles.activeCommentContainer}>
              <TextInput
                autoFocus
                placeholder="Nom de la liste"
                placeholderTextColor={colors.disabled}
                style={articleStyles.addListInput}
                value={createListText}
                onChangeText={(text) => {
                  setErrorVisible(false);
                  setCreateListText(text);
                }}
              />
              <CollapsibleView collapsed={!errorVisible}>
                <HelperText type="error" visible={errorVisible}>
                  Vous devez entrer un nom
                </HelperText>
              </CollapsibleView>
              <CollapsibleView collapsed={!lists.some((l) => l.name === createListText)}>
                <HelperText type="error" visible={lists.some((l) => l.name === createListText)}>
                  Une liste avec ce nom existe déjà
                </HelperText>
              </CollapsibleView>
            </View>
            <Divider />
            <View style={styles.contentContainer}>
              <Button
                mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                color={colors.primary}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => {
                  if (createListText === '') {
                    setErrorVisible(true);
                  } else if (!lists.some((l) => l.name === createListText)) {
                    // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                    addArticleList(createListText);
                    setCreateListText('');
                    setCreateModalVisible(false);
                  }
                }}
              >
                Créer la liste
              </Button>
            </View>
          </View>
        </Card>
      </Modal>

      <Modal
        isVisible={isEditModalVisible}
        avoidKeyboard
        onBackdropPress={() => setEditModalVisible(false)}
        onBackButtonPress={() => setEditModalVisible(false)}
        onSwipeComplete={() => setEditModalVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <Card>
          <View>
            <Divider />

            <View style={articleStyles.activeCommentContainer}>
              <PaperTextInput
                autoFocus
                mode="outlined"
                label="Nom"
                value={editListText}
                onChangeText={(text) => {
                  setErrorVisible(false);
                  setEditListText(text);
                }}
              />
              <CollapsibleView collapsed={!errorVisible}>
                <HelperText type="error" visible={errorVisible}>
                  Vous devez entrer un nom
                </HelperText>
              </CollapsibleView>
              <CollapsibleView
                collapsed={!lists.some((l) => l.name === editListText && l.id !== editingList)}
              >
                <HelperText
                  type="error"
                  visible={lists.some((l) => l.name === editListText && l.id !== editingList)}
                >
                  Une liste avec ce nom existe déjà
                </HelperText>
              </CollapsibleView>
            </View>
            <View style={articleStyles.activeCommentContainer}>
              <PaperTextInput
                mode="outlined"
                multiline
                label="Description"
                value={editListDescription}
                onChangeText={(text) => {
                  setEditListDescription(text);
                }}
              />
            </View>
            <Divider style={{ marginTop: 10 }} />
            <View style={styles.contentContainer}>
              <Button
                mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                color={colors.primary}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => {
                  if (editListText === '') {
                    setErrorVisible(true);
                  } else if (!lists.some((l) => l.name === editListText && l.id !== editingList)) {
                    // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                    modifyArticleList(editingList, editListText, null, editListDescription);
                    setEditListText('');
                    setEditListDescription('');
                    setEditModalVisible(false);
                  }
                }}
              >
                Modifier
              </Button>
            </View>
          </View>
        </Card>
      </Modal>
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { articleData, preferences, account } = state;
  return {
    lists: articleData.lists,
    articlePrefs: articleData.prefs,
    preferences,
    account,
  };
};

export default connect(mapStateToProps)(ArticleLists);

ArticleLists.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  params: PropTypes.shape().isRequired,
  state: PropTypes.shape({
    info: PropTypes.shape({}).isRequired,
  }).isRequired,
};
