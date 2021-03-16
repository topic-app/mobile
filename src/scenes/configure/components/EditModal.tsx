import React from 'react';
import { View, Platform } from 'react-native';
import {
  Divider,
  Button,
  HelperText,
  TextInput as PaperTextInput,
  useTheme,
} from 'react-native-paper';
import { connect } from 'react-redux';

import { CollapsibleView, Modal } from '@components';
import { modifyArticleList } from '@redux/actions/contentData/articles';
import { modifyEventList } from '@redux/actions/contentData/events';
import { ModalProps, State, ArticleListItem, EventListItem } from '@ts/types';

import getStyles from './styles';

type EditModalProps = ModalProps & {
  articleLists: ArticleListItem[];
  eventLists: EventListItem[];
  editingList: ArticleListItem | EventListItem | null;
  setEditingList: (props: ArticleListItem | EventListItem | null) => void;
  type: 'articles' | 'events';
};

function EditModal({
  visible,
  setVisible,
  articleLists,
  eventLists,
  editingList,
  setEditingList,
  type,
}: EditModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const lists = type === 'articles' ? articleLists : eventLists;

  const [errorVisible, setErrorVisible] = React.useState(false);

  if (!editingList) return null;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={styles.activeCommentContainer}>
          <PaperTextInput
            autoFocus
            mode="outlined"
            label="Nom"
            value={editingList.name}
            onChangeText={(text) => {
              setErrorVisible(false);
              setEditingList({ ...editingList, name: text });
            }}
          />
          <CollapsibleView collapsed={!errorVisible}>
            <HelperText type="error" visible={errorVisible}>
              Vous devez entrer un nom
            </HelperText>
          </CollapsibleView>
          <CollapsibleView
            collapsed={
              !lists.some(
                (l: ArticleListItem | EventListItem) =>
                  l.name === editingList.name && l.id !== editingList.id,
              )
            }
          >
            <HelperText
              type="error"
              visible={lists.some(
                (l: ArticleListItem | EventListItem) =>
                  l.name === editingList.name && l.id !== editingList.id,
              )}
            >
              Une liste avec ce nom existe déjà
            </HelperText>
          </CollapsibleView>
        </View>
        <View style={styles.activeCommentContainer}>
          <PaperTextInput
            mode="outlined"
            multiline
            label="Description"
            value={editingList?.description}
            onChangeText={(text) => {
              setEditingList({ ...editingList, description: text });
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
              if (editingList.name === '') {
                setErrorVisible(true);
              } else if (
                !lists.some(
                  (l: ArticleListItem | EventListItem) =>
                    l.name === editingList.name && l.id !== editingList.id,
                )
              ) {
                // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                if (type === 'articles') {
                  modifyArticleList(
                    editingList.id,
                    editingList.name,
                    undefined,
                    editingList.description,
                  );
                } else {
                  modifyEventList(
                    editingList.id,
                    editingList.name,
                    undefined,
                    editingList.description,
                  );
                }
                setEditingList(null);
                setVisible(false);
              }
            }}
          >
            Modifier
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = (state: State) => {
  const { articleData, eventData } = state;
  return {
    articleLists: articleData.lists,
    eventLists: eventData.lists,
  };
};

export default connect(mapStateToProps)(EditModal);
