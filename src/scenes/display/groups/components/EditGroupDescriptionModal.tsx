import { Formik } from 'formik';
import React from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { Divider, Button, Title, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { Modal, Avatar, FileUpload, FormTextInput } from '@components';
import { fetchGroup } from '@redux/actions/api/groups';
import { groupModify } from '@redux/actions/apiActions/groups';
import {
  ModalProps,
  State,
  Group,
  GroupRequestState,
  GroupPreload,
  Avatar as AvatarType,
  UploadRequestState,
} from '@ts/types';
import { Errors } from '@utils';

import getStyles from '../styles';

type EditGroupDescriptionModalProps = ModalProps & {
  group: Group | GroupPreload | null;
  editingGroup: {
    id?: string;
    name?: string;
    shortName?: string;
    summary?: string;
    description?: string;
    avatar?: AvatarType;
  } | null;
  state: GroupRequestState;
  uploadState: UploadRequestState;
};

const EditGroupDescriptionModal: React.FC<EditGroupDescriptionModalProps> = ({
  visible,
  setVisible,
  group,
  editingGroup,
  state,
  uploadState,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [errorVisible, setErrorVisible] = React.useState(false);

  const submit = ({
    shortName,
    summary,
    description,
    file,
  }: {
    shortName?: string;
    summary: string;
    description?: string;
    file?: string;
  }) => {
    if (group) {
      groupModify(group?._id, {
        ...(shortName ? { shortName } : {}),
        ...(summary ? { summary } : {}),
        ...(description ? { description: { parser: 'markdown', data: description } } : {}),
        avatar: editingGroup?.avatar,
        ...(file
          ? {
              avatar: {
                type: 'image',
                image: {
                  image: file,
                  thumbnails: { small: true, medium: false, large: true },
                },
              },
            }
          : {}),
      })
        .then(() => {
          fetchGroup(group?._id);
          setVisible(false);
        })
        .catch((error) =>
          Errors.showPopup({
            type: 'axios',
            what: 'la modification du groupe',
            error,
            retry: () => submit({ shortName, summary, description, file }),
          }),
        );
    }
  };

  const GroupSchema = Yup.object().shape({
    shortName: Yup.string()
      .min(2, "L'acronyme doit contenir au moins 2 caractères")
      .max(20, "L'acronyme doit contenir moins de 20 caractères"),
    description: Yup.string(),
    summary: Yup.string()
      .max(200, 'La description courte doit contenir moins de 200 caractères.')
      .required('Description courte requise'),
    file: Yup.mixed(),
  });

  if (!editingGroup) return null;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Formik
        initialValues={{
          shortName: editingGroup.shortName,
          summary: editingGroup.summary || '',
          description: editingGroup.description,
        }}
        validationSchema={GroupSchema}
        onSubmit={submit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <View style={[styles.centerIllustrationContainer, styles.container, { marginTop: 30 }]}>
              <Title style={{ fontSize: 24 }}>{editingGroup.name}</Title>
            </View>
            <Divider />
            <View style={styles.container}>
              <FileUpload
                file={values.file || null}
                setFile={(file) => {
                  handleChange('file')(file || '');
                }}
                title={Platform.OS === 'web' ? "Changer l'avatar" : 'Avatar'}
                allowDelete={false}
                group={editingGroup.id || ''}
                resizeMode="avatar"
                type="avatar"
              />
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Acronyme ou abréviation (facultatif)"
                  info="Acronyme ou abréviation reconnaissable, qui sera affichée en priorité sur vos contenus"
                  value={values.shortName}
                  touched={touched.shortName}
                  error={errors.shortName}
                  onChangeText={handleChange('shortName')}
                  onBlur={handleBlur('shortName')}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Description courte"
                  info="Décrivez votre groupe en une ou deux phrases"
                  multiline
                  numberOfLines={3}
                  value={values.summary}
                  touched={touched.summary}
                  error={errors.summary}
                  onChangeText={handleChange('summary')}
                  onBlur={handleBlur('summary')}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Description longue (facultatif)"
                  info="Cette description sera affichée sur votre page de groupe"
                  multiline
                  numberOfLines={6}
                  value={values.description}
                  touched={touched.description}
                  error={errors.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  onSubmitEditing={() => handleSubmit()}
                  style={styles.textInput}
                />
              </View>
            </View>
            <Divider style={{ marginTop: 10 }} />
            <View style={styles.contentContainer}>
              <Button
                mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                color={colors.primary}
                loading={state.modify?.loading}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => handleSubmit()}
              >
                Mettre à jour
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { groups, upload } = state;
  return {
    state: groups.state,
    uploadState: upload.state,
  };
};

export default connect(mapStateToProps)(EditGroupDescriptionModal);
