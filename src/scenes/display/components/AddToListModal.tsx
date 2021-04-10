import React from 'react';
import { View, Platform, TextInput, FlatList } from 'react-native';
import {
  Divider,
  Button,
  Text,
  RadioButton,
  List,
  IconButton,
  HelperText,
  useTheme,
} from 'react-native-paper';
import { connect } from 'react-redux';

import { CollapsibleView, Illustration, Modal } from '@components';
import { addArticleToList, addArticleList } from '@redux/actions/contentData/articles';
import { addEventToList, addEventList } from '@redux/actions/contentData/events';
import { ModalProps, State, ArticleListItem, EventListItem, Article, Event } from '@ts/types';
import { trackEvent } from '@utils';

import getStyles from './styles';

type AddToListModalProps = ModalProps & {
  id: string;
  articleLists: ArticleListItem[];
  eventLists: EventListItem[];
  type: 'article' | 'event';
};

const AddToListModal: React.FC<AddToListModalProps> = ({
  visible,
  setVisible,
  articleLists,
  eventLists,
  id,
  type,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const lists = (type === 'article' ? articleLists : eventLists) as (
    | ArticleListItem
    | EventListItem
  )[];

  const [list, setList] = React.useState<string | null>(lists[0]?.id);
  const [createList, setCreateList] = React.useState(false);
  const [errorVisible, setErrorVisible] = React.useState(false);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <FlatList
        data={lists}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.contentContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="article-lists" height={200} width={200} />
                <Text>Ajouter cet article à une liste</Text>
              </View>
            </View>
            <Divider />
          </View>
        )}
        renderItem={({ item }: { item: ArticleListItem | EventListItem }) => {
          const disabled = item?.items?.some((i: Article | Event) => i._id === id);
          return (
            <View>
              <List.Item
                title={item.name}
                onPress={() => {
                  if (!disabled) {
                    setCreateList(false);
                    setList(item.id);
                  }
                }}
                left={() =>
                  Platform.OS !== 'ios' && (
                    <RadioButton
                      value=""
                      disabled={disabled}
                      color={colors.primary}
                      status={item.id === list ? 'checked' : 'unchecked'}
                      onPress={() => {
                        if (!disabled) {
                          setCreateList(false);
                          setList(item.id);
                        }
                      }}
                    />
                  )
                }
                right={() =>
                  Platform.OS === 'ios' && (
                    <RadioButton
                      value=""
                      disabled={disabled}
                      color={colors.primary}
                      status={item.id === list ? 'checked' : 'unchecked'}
                      onPress={() => {
                        if (!disabled) {
                          setCreateList(false);
                          setList(item.id);
                        }
                      }}
                    />
                  )
                }
              />
            </View>
          );
        }}
        ListFooterComponent={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [createListText, setCreateListText] = React.useState('');
          return (
            <View>
              <List.Item
                title="Créer une liste"
                onPress={() => {
                  setList(null);
                  setCreateList(true);
                }}
                left={() =>
                  Platform.OS !== 'ios' && (
                    <IconButton
                      accessibilityLabel="Créer une liste"
                      style={{ width: 24, height: 24 }}
                      color={colors.primary}
                      icon="plus"
                      onPress={() => {
                        setList(null);
                        setCreateList(true);
                      }}
                    />
                  )
                }
              />
              <CollapsibleView collapsed={!createList}>
                <Divider />

                <View style={styles.activeCommentContainer}>
                  <TextInput
                    autoFocus
                    placeholder="Nom de la liste"
                    placeholderTextColor={colors.disabled}
                    style={styles.commentInput}
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
                </View>
                <CollapsibleView
                  collapsed={
                    !lists.some((l: EventListItem | ArticleListItem) => l.name === createListText)
                  }
                >
                  <HelperText
                    type="error"
                    visible={lists.some(
                      (l: EventListItem | ArticleListItem) => l.name === createListText,
                    )}
                  >
                    Une liste avec ce nom existe déjà
                  </HelperText>
                </CollapsibleView>
              </CollapsibleView>
              <Divider />
              <View style={styles.contentContainer}>
                <Button
                  mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                  color={colors.primary}
                  uppercase={Platform.OS !== 'ios'}
                  onPress={() => {
                    if (!createList) {
                      trackEvent('lists:add-item-to-list', { props: { method: 'modal' } });
                      setVisible(false);
                      if (type === 'article') {
                        addArticleToList(id, list || '');
                      } else {
                        addEventToList(id, list || '');
                      }
                    } else if (createListText === '') {
                      setErrorVisible(true);
                    } else if (
                      !lists.some((l: EventListItem | ArticleListItem) => l.name === createListText)
                    ) {
                      trackEvent('lists:create-list', { props: { method: 'modal' } });
                      // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                      if (type === 'article') {
                        addArticleList(createListText);
                      } else {
                        addEventList(createListText);
                      }
                      setCreateList(false);
                      setCreateListText('');
                    }
                  }}
                  style={{ flex: 1 }}
                >
                  {createList ? 'Créer la liste' : 'Ajouter'}
                </Button>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { articleData, eventData } = state;
  return {
    articleLists: articleData.lists,
    eventLists: eventData.lists,
  };
};

export default connect(mapStateToProps)(AddToListModal);
