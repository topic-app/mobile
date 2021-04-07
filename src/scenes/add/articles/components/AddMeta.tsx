import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput, Image } from 'react-native';
import { Button, ProgressBar, Card, Text, List, Switch, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, ErrorMessage, FormTextInput } from '@components';
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

  const uploadImage = () => upload(creationData.group || '');

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
            {checkPermission(account, {
              permission: Permissions.CONTENT_UPLOAD,
              scope: { groups: [creationData.group || ''] },
            }) ? (
              <View>
                {values.file && !state.upload?.loading && (
                  <View style={styles.container}>
                    <Card style={{ minHeight: 100 }}>
                      <Image
                        source={{
                          uri:
                            getImageUrl({
                              image: { image: values.file, thumbnails: {} },
                              size: 'full',
                            }) || '',
                        }}
                        style={{ height: 250 }}
                        resizeMode="contain"
                      />
                    </Card>
                  </View>
                )}
                <View style={[styles.container, { marginBottom: 30 }]}>
                  {state.upload?.error && (
                    <ErrorMessage
                      error={state.upload?.error}
                      strings={{
                        what: "l'upload de l'image",
                        contentSingular: "L'image",
                      }}
                      type="axios"
                      retry={() => uploadImage().then((id) => setFieldValue('file', id))}
                    />
                  )}
                  {state.upload?.loading ? (
                    <Card style={{ height: 50, flex: 1 }}>
                      <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                        <View>
                          <Icon name="image" size={24} color={colors.disabled} />
                        </View>
                        <View style={{ marginHorizontal: 10, flexGrow: 1 }}>
                          <ProgressBar indeterminate />
                        </View>
                      </View>
                    </Card>
                  ) : (
                    <View style={{ flexDirection: 'row' }}>
                      <Button
                        mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                        uppercase={false}
                        onPress={() => {
                          trackEvent(
                            values.file
                              ? 'articleadd:meta-image-replace'
                              : 'articleadd-meta-image-upload',
                          );
                          uploadImage().then((id) => setFieldValue('file', id));
                        }}
                        style={{ flex: 1, marginRight: 5 }}
                      >
                        {values.file ? 'Remplacer' : 'Séléctionner une image'}
                      </Button>
                      {values.file ? (
                        <Button
                          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                          uppercase={false}
                          onPress={() => {
                            trackEvent('articleadd:meta-image-remove');
                            setFieldValue('file', null);
                          }}
                          style={{ flex: 1, marginLeft: 5 }}
                        >
                          Supprimer
                        </Button>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <Card style={{ height: 50, flex: 1, marginBottom: 30 }}>
                <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                  <View>
                    <Icon name="image" size={24} color={colors.disabled} />
                  </View>
                  <View style={{ marginHorizontal: 10, flexGrow: 1 }}>
                    <Text>
                      Vous n&apos;avez pas l&apos;autorisation d&apos;ajouter des images pour ce
                      groupe
                    </Text>
                  </View>
                </View>
              </Card>
            )}
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
                disabled={state.upload?.loading}
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
