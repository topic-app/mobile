import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput, Image } from 'react-native';
import { Button, ProgressBar, Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, ErrorMessage, FormTextInput, FileUpload } from '@components';
import { upload } from '@redux/actions/apiActions/upload';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import { State, EventCreationData, UploadRequestState, Account } from '@ts/types';
import { getImageUrl, checkPermission, Permissions } from '@utils';

import getStyles from '../styles';

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
  const titleInput = createRef<RNTextInput>();
  const summaryInput = createRef<RNTextInput>();

  const uploadImage = () => upload(creationData.group || '');

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  if (!account.loggedIn) return null;

  const MetaSchema = Yup.object().shape({
    title: Yup.string()
      .min(10, 'Le titre doit contenir au moins 10 caractères')
      .max(100, 'Le titre doit contenir moins de 100 caractères')
      .required('Titre requis'),
    summary: Yup.string().max(500, 'Le résumé doit contenir moins de 500 caractères'),
    file: Yup.mixed(),
  });

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{ title: '', summary: '', file: null }}
        validationSchema={MetaSchema}
        onSubmit={({ title, summary, file }) => {
          updateEventCreationData({
            title,
            summary,
            image: { image: file, thumbnails: { small: false, medium: true, large: true } },
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
              placeholder="Laissez vide pour sélectionner les premières lignes de la description"
              multiline
              numberOfLines={4}
              value={values.summary}
              touched={touched.summary}
              error={errors.summary}
              onChangeText={handleChange('summary')}
              onBlur={handleBlur('summary')}
              onSubmitEditing={() => summaryInput.current?.focus()}
              style={styles.textInput}
            />
            <FileUpload
              file={values.file}
              setFile={(file) => setFieldValue('file', file)}
              group={creationData.group || ''}
            />
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
  const { upload, eventData, account } = state;
  return { state: upload.state, creationData: eventData.creationData, account };
};

export default connect(mapStateToProps)(EventAddPageMeta);
