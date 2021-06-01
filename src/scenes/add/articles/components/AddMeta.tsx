import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput, Image } from 'react-native';
import { Button, ProgressBar, Card, Text, List, Switch, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, ErrorMessage, FormTextInput, FileUpload } from '@components';
import { upload } from '@redux/actions/apiActions/upload';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';
import { State, ArticleCreationData, UploadRequestState, Account } from '@ts/types';
import { getImageUrl, checkPermission, trackEvent, Permissions } from '@utils';

import getStyles from '../styles';

type ArticleAddPageMetaProps = StepperViewPageProps & {
  creationData: ArticleCreationData;
  state: UploadRequestState;
  account: Account;
};

const ArticleAddPageMeta: React.FC<ArticleAddPageMetaProps> = ({
  next,
  prev,
  creationData,
  state,
  account,
}) => {
  const titleInput = createRef<RNTextInput>();
  const summaryInput = createRef<RNTextInput>();

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const [isOpinion, setOpinion] = React.useState(creationData.opinion || false);

  if (!account.loggedIn) return null;

  const MetaSchema = Yup.object().shape({
    title: Yup.string()
      .min(10, 'Le titre doit contenir au moins 10 caractères.')
      .max(100, 'Le titre doit contenir moins de 100 caractères.')
      .required('Titre requis'),
    summary: Yup.string().max(500, 'Le résumé doit contenir moins de 500 caractères.'),
    file: Yup.mixed(),
  });

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{
          title: creationData.title || '',
          summary: creationData.summary || '',
          file: creationData.image?.image || null,
        }}
        validationSchema={MetaSchema}
        onSubmit={({ title, summary, file }) => {
          trackEvent('articleadd:page-tags');
          updateArticleCreationData({
            title,
            summary,
            image: { image: file, thumbnails: { small: false, medium: true, large: true } },
            opinion: isOpinion,
          });
          next();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            <FormTextInput
              ref={titleInput}
              label="Titre"
              value={values.title}
              touched={touched.title}
              error={errors.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              onSubmitEditing={() => summaryInput.current?.focus()}
              style={styles.textInput}
              autoFocus
            />
            <FormTextInput
              ref={summaryInput}
              label="Résumé"
              placeholder="Laissez vide pour sélectionner les premières lignes de l'article."
              multiline
              numberOfLines={4}
              value={values.summary}
              touched={touched.summary}
              error={errors.summary}
              onChangeText={handleChange('summary')}
              onBlur={handleBlur('summary')}
              onSubmitEditing={() => handleSubmit()}
              style={styles.textInput}
            />
            <FileUpload
              file={values.file}
              setFile={(file) => setFieldValue('file', file)}
              group={creationData.group || ''}
            />
            <View style={[styles.container, { marginBottom: 40 }]}>
              <List.Item
                title="Article d'opinion"
                description="Vous devez spécifier si votre article n'est pas factuel (articles d'opinion, d'analyse)"
                onPress={() => setOpinion(!isOpinion)}
                right={() => (
                  <Switch
                    color={colors.primary}
                    value={isOpinion}
                    onValueChange={(data) => setOpinion(data)}
                  />
                )}
                descriptionNumberOfLines={10}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => prev()}
                style={{ flex: 1, marginRight: 5 }}
              >
                Retour
              </Button>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={handleSubmit}
                disabled={state.permission.loading || state.upload.loading}
                style={{ flex: 1, marginLeft: 5 }}
              >
                Suivant
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { upload, articleData, account } = state;
  return { state: upload.state, creationData: articleData.creationData, account };
};

export default connect(mapStateToProps)(ArticleAddPageMeta);
