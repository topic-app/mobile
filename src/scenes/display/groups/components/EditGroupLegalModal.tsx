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
      .min(2, 'Le nom doit contenir au moins 2 charact??res')
      .max(500, 'Le nom doit contenir moins de 500 caract??res'),
    id: Yup.string()
      .min(5, "L'identifiant doit contenir au moins 5 caract??res")
      .max(100, "L'identifiant doit contenir moins de 100??caract??res"),
    admin: Yup.string()
      .min(2, 'Votre nom doit contenir au moins 2 carat??res')
      .max(200, 'Votre nom doit contenir moins de 200 caract??res')
      .required('Votre nom est requis'),
    address: Yup.string()
      .min(10, 'Le si??ge social doit contenir au moins 10 carat??res')
      .max(200, 'Le si??ge social doit contenir moins de 200 caract??res'),
    email: Yup.string().email("L'adresse email doit ??tre valide").required('Adresse email requis'),
    extra: Yup.string().max(
      1000,
      'Les donn??es suppl??mentaires ne doivent pas d??passer 1000 caract??res',
    ),
    extraVerification: Yup.string().max(
      10000,
      'Les donn??es suppl??mentaires ne doivent pas d??passer 10000 caract??res',
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
                  label="Nom exact de l'entit?? l??gale (facultatif)"
                  info="Si vous ??tes une association ou une autre entit?? l??gale, donnez le nom officiel. Si vous n'avez pas de structure l??gale, laissez vide."
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
                  info="Si vous ??tes une entit?? l??gale, donnez votre RNA, SIRET, ou DUNS, sous la forme SIRET: 88483577800017 par exemple."
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
                  label="Responsable l??gal"
                  info="Donnez le nom complet du responsable l??gal de votre groupe, ou votre nom si le groupe n'a pas de structure l??gale. Assurez vous que vous avez bien l'autorisation de la personne concern??e avant de rentrer son nom. Le nom doit ??tre complet, tel qu'il apparait sur les documents l??gaux (passport, carte d'identit??)."
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
                  label="Si??ge social (facultatif)"
                  info="Donnez l'adresse du si??ge social de votre structure si vous en avez"
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
                  info="Donnez une adresse email par laquelle les gens pourront vous contacter. Cette adresse sera v??rifi??e et affich??e publiquement."
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
                  label="Informations suppl??mentaires (facultatif)"
                  info="Vous pouvez donner des informations suppl??mentaires sur la structure l??gale votre groupe. Ces informations seront publiques"
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
                  title="Je confirme que toutes les informations que j'ai donn?? sur ce groupe sont correctes, et que j'ai l'autorisation de les modifier"
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
                Mettre ?? jour
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
