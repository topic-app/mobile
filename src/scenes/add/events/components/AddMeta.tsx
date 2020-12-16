import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTestInput, Image } from 'react-native';
import { Button, ProgressBar, Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, ErrorMessage, FormTextInput } from '@components/index';
import { Permissions } from '@constants/index';
import { upload } from '@redux/actions/apiActions/upload';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { State, EventCreationData, UploadRequestState, Account } from '@ts/types';
import { useTheme, getImageUrl, checkPermission } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type EventAddPageMetaProps = StepperViewPageProps & {
  creationData: EventCreationData;
  state: UploadRequestState;
  account: Account;
};

const EventAddPageMeta: React.FC<EventAddPageMetaProps> = ({
  next,
  prev,
  creationData,
  state,
  account,
}) => {
  const titleInput = createRef<RNTestInput>();
  const summaryInput = createRef<RNTestInput>();
  const descriptionInput = createRef<RNTestInput>();

  const uploadImage = () => upload(creationData.group || '');

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getArticleStyles(theme);
  const styles = getStyles(theme);

  if (!account.loggedIn) return null;

  const MetaSchema = Yup.object().shape({
    title: Yup.string()
      .min(10, 'Le titre doit contenir au moins 10 caractères')
      .max(100, 'Le titre doit contenir moins de 100 caractères')
      .required('Titre requis'),
    summary: Yup.string().max(500, 'Le résumé doit contenir moins de 500 caractères.'),
    file: Yup.mixed(),
    description: Yup.string().required('Description requise'),
  });

  return (
    <View style={articleStyles.formContainer}>
      <Formik
        initialValues={{ title: '', summary: '', file: null, description: '' }}
        validationSchema={MetaSchema}
        onSubmit={({ title, summary, file, description }) => {
          updateEventCreationData({
            title,
            summary,
            image: { image: file, thumbnails: { small: false, medium: true, large: true } },
            description,
            parser: 'markdown',
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
              style={articleStyles.textInput}
              autoFocus
            />
            <FormTextInput
              ref={summaryInput}
              label="Résumé"
              placeholder="Laissez vide pour selectionner les premières lignes de la description"
              multiline
              numberOfLines={4}
              value={values.summary}
              touched={touched.summary}
              error={errors.summary}
              onChangeText={handleChange('summary')}
              onBlur={handleBlur('summary')}
              onSubmitEditing={() => summaryInput.current?.focus()}
              style={articleStyles.textInput}
            />
            <FormTextInput
              ref={descriptionInput}
              label="Description"
              multiline
              numberOfLines={8}
              value={values.description}
              touched={touched.description}
              error={errors.description}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              onSubmitEditing={() => handleSubmit()}
              style={articleStyles.textInput}
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
                        onPress={() => uploadImage().then((id) => setFieldValue('file', id))}
                        style={{ flex: 1, marginRight: 5 }}
                      >
                        {values.file ? "Remplacer l'image" : 'Séléctionner une image'}
                      </Button>
                      {values.file ? (
                        <Button
                          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                          uppercase={false}
                          onPress={() => setFieldValue('file', null)}
                          style={{ flex: 1, marginLeft: 5 }}
                        >
                          Supprimer l&apos;image
                        </Button>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <Card style={{ height: 50, flex: 1, marginBottom: 40 }}>
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
            <View style={articleStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                uppercase={Platform.OS !== 'ios'}
                onPress={prev}
                style={{ flex: 1, marginRight: 5 }}
              >
                Retour
              </Button>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={handleSubmit}
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
  const { upload, eventData, account } = state;
  return { state: upload.state, creationData: eventData.creationData, account };
};

export default connect(mapStateToProps)(EventAddPageMeta);
