import React from 'react';
import { ModalProps, State, ArticleListItem, EventListItem } from '@ts/types';
import {
  Divider,
  Button,
  HelperText,
  TextInput as PaperTextInput,
  Card,
  ThemeProvider,
  useTheme,
} from 'react-native-paper';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';

import { CollapsibleView, Modal } from '@components/index';
import getStyles from '@styles/Styles';
import { modifyArticleList } from '@redux/actions/contentData/articles';
import { modifyEventList } from '@redux/actions/contentData/events';
import getArticleStyles from './styles/Styles';

type EditModalProps = ModalProps & {
  articleLists: ArticleListItem[];
  eventLists: EventListItem[];
  editingList: ArticleListItem | null;
  setEditingList: (props: ArticleListItem | null) => void;
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
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const lists = type === 'articles' ? articleLists : eventLists;

  const [errorVisible, setErrorVisible] = React.useState(false);

  if (!editingList) return null;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={articleStyles.activeCommentContainer}>
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
            collapsed={!lists.some((l) => l.name === editingList.name && l.id !== editingList.id)}
          >
            <HelperText
              type="error"
              visible={lists.some((l) => l.name === editingList.name && l.id !== editingList.id)}
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
                !lists.some((l) => l.name === editingList.name && l.id !== editingList.id)
              ) {
                // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                if (type === 'articles') {
                  modifyArticleList(
                    editingList.id,
                    editingList.name,
                    null,
                    editingList.description,
                  );
                } else {
                  modifyEventList(editingList.id, editingList.name, null, editingList.description);
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
