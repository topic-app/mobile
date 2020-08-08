import React from 'react';
import { ModalProps, State, ArticleListItem, Account } from '@ts/types';
import {
  Divider,
  Button,
  Text,
  Card,
  useTheme,
  RadioButton,
  List,
  IconButton,
  HelperText,
} from 'react-native-paper';
import { View, Platform, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { config } from '@root/app.json';

import {
  CollapsibleView,
  CategoriesList,
  PlatformIconButton,
  Illustration,
} from '@components/index';
import getStyles from '@styles/Styles';
import getArticleStyles from '../styles/Styles';
import { logger } from '@root/src/utils';

import { addArticleToList, addArticleList } from '@redux/actions/contentData/articles';

type CommentPublisher = {
  key: string;
  title: string;
  icon: string;
  publisher: {
    type: 'user' | 'group';
    group?: string;
  };
  type: 'category';
};

type AddToListModalProps = ModalProps & {
  id: string;
  lists: ArticleListItem[];
};

function AddToListModal({ visible, setVisible, lists, id }: AddToListModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [list, setList] = React.useState(lists[0]?.id);
  const [createList, setCreateList] = React.useState(false);
  const [errorVisible, setErrorVisible] = React.useState(false);

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection={['down']}
      style={styles.bottomModal}
    >
      <Card>
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
          renderItem={({ item }) => {
            const disabled = item?.items?.some((i) => i._id === id);
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

                  <View style={articleStyles.activeCommentContainer}>
                    <TextInput
                      autoFocus
                      placeholder="Nom de la liste"
                      placeholderTextColor={colors.disabled}
                      style={articleStyles.commentInput}
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
                  <CollapsibleView collapsed={!lists.some((l) => l.name === createListText)}>
                    <HelperText type="error" visible={lists.some((l) => l.name === createListText)}>
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
                        setVisible(false);
                        addArticleToList(id, list);
                      } else if (createListText === '') {
                        setErrorVisible(true);
                      } else if (!lists.some((l) => l.name === createListText)) {
                        // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                        addArticleList(createListText);
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
      </Card>
    </Modal>
  );
}

const mapStateToProps = (state: State) => {
  const { articleData } = state;
  return {
    lists: articleData.lists,
  };
};

export default connect(mapStateToProps)(AddToListModal);
