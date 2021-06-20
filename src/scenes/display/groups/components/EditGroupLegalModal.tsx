import { Formik } from 'formik';
import React from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { Divider, Button, Title, useTheme, HelperText, Checkbox, List } from 'react-native-paper';
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
    legal?: {
      id?: string;
      name?: string;
      admin?: string;
      address?: string;
      email?: string;
      extra?: string;
    };
  } | null;
  state: GroupRequestState;
  uploadState: UploadRequestState;
};

const EditGroupLegalModal: React.FC<EditGroupDescriptionModalProps> = ({
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
    name,
    id,
    admin,
    address,
    email,
    extra,
  }: {
    id?: string;
    name?: string;
    admin: string;
    address?: string;
    email: string;
    extra?: string;
  }) => {
    if (group) {
      groupModify(group?._id, {
        legal: { name, id, admin, address, email, extra },
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
            retry: () => submit({ name, id, admin, address, email, extra }),
          }),
        );
    }
  };

  const GroupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Le nom doit contenir au moins 2 charactères')
      .max(500, 'Le nom doit contenir moins de 500 caractères'),
    id: Yup.string()
      .min(5, "L'identifiant doit contenir au moins 5 caractères")
      .max(100, "L'identifiant doit contenir moins de 100 caractères"),
    admin: Yup.string()
      .min(2, 'Votre nom doit contenir au moins 2 caratères')
      .max(200, 'Votre nom doit contenir moins de 200 caractères')
      .required('Votre nom est requis'),
    address: Yup.string()
      .min(10, 'Le siège social doit contenir au moins 10 caratères')
      .max(200, 'Le siège social doit contenir moins de 200 caractères'),
    email: Yup.string().email("L'adresse email doit être valide").required('Adresse email requis'),
    extra: Yup.string().max(
      1000,
      'Les données supplémentaires ne doivent pas dépasser 1000 caractères',
    ),
    extraVerification: Yup.string().max(
      10000,
      'Les données supplémentaires ne doivent pas dépasser 10000 caractères',
    ),
    correct: Yup.boolean().equals([true], 'Vous devez confirmer'),
  });

  if (!editingGroup) return null;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Formik
        initialValues={{
          name: editingGroup.legal?.name || '',
          id: editingGroup.legal?.id || '',
          admin: editingGroup.legal?.admin || '',
          address: editingGroup.legal?.address || '',
          email: editingGroup.legal?.email || '',
          extra: editingGroup.legal?.extra || '',
          correct: false,
        }}
        validationSchema={GroupSchema}
        onSubmit={submit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            <View style={[styles.centerIllustrationContainer, styles.container, { marginTop: 30 }]}>
              <Title style={{ fontSize: 24 }}>{editingGroup.name}</Title>
            </View>
            <Divider />
            <View style={styles.container}>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Nom exact de l'entité légale (facultatif)"
                  info="Si vous êtes une association ou une autre entité légale, donnez le nom officiel. Si vous n'avez pas de structure légale, laissez vide."
                  value={values.name}
                  touched={touched.name}
                  error={errors.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  style={styles.textInput}
                  autoFocus
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Identifiant (facultatif)"
                  info="Si vous êtes une entité légale, donnez votre RNA, SIRET, ou DUNS, sous la forme SIRET: 88483577800017 par exemple."
                  value={values.id}
                  touched={touched.id}
                  error={errors.id}
                  onChangeText={handleChange('id')}
                  onBlur={handleBlur('id')}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Responsable légal"
                  info="Donnez le nom complet du responsable légal de votre groupe, ou votre nom si le groupe n'a pas de structure légale. Assurez vous que vous avez bien l'autorisation de la personne concernée avant de rentrer son nom. Le nom doit être complet, tel qu'il apparait sur les documents légaux (passport, carte d'identité)."
                  value={values.admin}
                  touched={touched.admin}
                  error={errors.admin}
                  onChangeText={handleChange('admin')}
                  onBlur={handleBlur('admin')}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Siège social (facultatif)"
                  info="Donnez l'adresse du siège social de votre structure si vous en avez"
                  value={values.address}
                  touched={touched.address}
                  error={errors.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Adresse email"
                  info="Donnez une adresse email par laquelle les gens pourront vous contacter. Cette adresse sera vérifiée et affichée publiquement."
                  value={values.email}
                  touched={touched.email}
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCompleteType="email"
                  error={errors.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={styles.textInput}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  label="Informations supplémentaires (facultatif)"
                  info="Vous pouvez donner des informations supplémentaires sur la structure légale votre groupe. Ces informations seront publiques"
                  multiline
                  numberOfLines={3}
                  value={values.extra}
                  touched={touched.extra}
                  error={errors.extra}
                  onChangeText={handleChange('extra')}
                  onBlur={handleBlur('extra')}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.container}>
                <List.Item
                  title="Je confirme que toutes les informations que j'ai donné sur ce groupe sont correctes, et que j'ai l'autorisation de les modifier"
                  titleNumberOfLines={20}
                  left={() =>
                    Platform.OS !== 'ios' ? (
                      <Checkbox
                        status={values.correct ? 'checked' : 'unchecked'}
                        color={colors.primary}
                      />
                    ) : null
                  }
                  right={() =>
                    Platform.OS === 'ios' ? (
                      <Checkbox
                        status={values.correct ? 'checked' : 'unchecked'}
                        color={colors.primary}
                      />
                    ) : null
                  }
                  onPress={() => setFieldValue('correct', !values.correct, true)}
                />
                <HelperText type="error" visible={!!errors.correct}>
                  {errors.correct}
                </HelperText>
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

export default connect(mapStateToProps)(EditGroupLegalModal);
