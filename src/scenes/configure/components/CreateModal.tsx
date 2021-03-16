import { Formik } from 'formik';
import React from 'react';
import { View, Platform, TextInput } from 'react-native';
import { Divider, Button, HelperText, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { CollapsibleView, Modal } from '@components';
import { addArticleList } from '@redux/actions/contentData/articles';
import { addEventList } from '@redux/actions/contentData/events';
import { ModalProps, State, ArticleListItem, EventListItem } from '@ts/types';

import getStyles from './styles';

type CreateModalProps = ModalProps & {
  articleLists: ArticleListItem[];
  eventLists: EventListItem[];
  type: 'articles' | 'events';
};

function CreateModal({ visible, setVisible, articleLists, eventLists, type }: CreateModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const lists = (type === 'articles' ? articleLists : eventLists) as Array<
    ArticleListItem | EventListItem
  >;

  const CreateListSchema = Yup.object().shape({
    name: Yup.string()
      .required('Vous devez entrer un nom')
      // check if there isn't already a list with the same name
      .notOneOf(
        lists.map((l) => l.name),
        'Une liste avec ce nom existe déjà',
      ),
  });

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <Divider />

        <View style={styles.activeCommentContainer}>
          <Formik
            initialValues={{ name: '' }}
            onSubmit={({ name }) => {
              // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
              if (type === 'articles') {
                addArticleList(name);
              } else {
                addEventList(name);
              }
              setVisible(false);
            }}
            validationSchema={CreateListSchema}
          >
            {({ handleSubmit, handleBlur, handleChange, errors, touched, values }) => (
              <View>
                <TextInput
                  placeholder="Nom de la liste"
                  placeholderTextColor={colors.disabled}
                  style={styles.addListInput}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  autoFocus
                />
                <CollapsibleView collapsed={!errors.name && !touched.name}>
                  <HelperText type="error">{errors.name}</HelperText>
                </CollapsibleView>
                <Divider />
                <View style={styles.container}>
                  <Button
                    mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                    color={colors.primary}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={() => {
                      handleSubmit();
                    }}
                  >
                    Créer la liste
                  </Button>
                </View>
              </View>
            )}
          </Formik>
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

export default connect(mapStateToProps)(CreateModal);
