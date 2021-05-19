import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput } from 'react-native';
import { HelperText, Button, Checkbox, List, Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, FormTextInput } from '@components';
import { updateGroupCreationData } from '@redux/actions/contentData/groups';
import { State, GroupRequestState, GroupCreationData } from '@ts/types';

import getStyles from '../styles';

type Props = StepperViewPageProps & {
  creationData: GroupCreationData;
  state: GroupRequestState;
  navigation: any;
};

const ArticleAddPageProof: React.FC<Props> = ({ next, prev, creationData, state, navigation }) => {
  const nameInput = createRef<RNTextInput>();
  const idInput = createRef<RNTextInput>();
  const adminInput = createRef<RNTextInput>();
  const addressInput = createRef<RNTextInput>();
  const emailInput = createRef<RNTextInput>();
  const extraInput = createRef<RNTextInput>();
  const extraVerificationInput = createRef<RNTextInput>();

  const MetaSchema = Yup.object().shape({
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
    terms: Yup.boolean().equals([true], 'Vous devez accepter les conditions'),
    correct: Yup.boolean().equals([true], 'Vous devez confirmer'),
  });

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{
          name: '',
          id: '',
          admin: '',
          address: '',
          email: '',
          extra: '',
          extraVerification: '',
          terms: false,
          correct: false,
        }}
        validationSchema={MetaSchema}
        onSubmit={({ extraVerification, terms, correct, ...legal }) => {
          updateGroupCreationData({
            legal,
            verification: {
              extra: extraVerification,
              id: legal.id,
              name: legal.name,
            },
          });
          next();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={nameInput}
                label="Nom exact de l'entité légale (facultatif)"
                info="Si vous êtes une association ou une autre entité légale, donnez le nom officiel. Si vous n'avez pas de structure légale, laissez vide."
                value={values.name}
                touched={touched.name}
                error={errors.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                onSubmitEditing={() => idInput.current?.focus()}
                style={styles.textInput}
                autoFocus
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={idInput}
                label="Identifiant (facultatif)"
                info="Si vous êtes une entité légale, donnez votre RNA, SIRET, ou DUNS, sous la forme SIRET: 88483577800017 par exemple."
                value={values.id}
                touched={touched.id}
                error={errors.id}
                onChangeText={handleChange('id')}
                onBlur={handleBlur('id')}
                onSubmitEditing={() => adminInput.current?.focus()}
                style={styles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={adminInput}
                label="Responsable légal"
                info="Donnez le nom complet du responsable légal de votre groupe, ou votre nom si le groupe n'a pas de structure légale. Assurez vous que vous avez bien l'autorisation de la personne concernée avant de rentrer son nom. Le nom doit être complet, tel qu'il apparait sur les documents légaux (passport, carte d'identité)."
                value={values.admin}
                touched={touched.admin}
                error={errors.admin}
                onChangeText={handleChange('admin')}
                onBlur={handleBlur('admin')}
                onSubmitEditing={() => addressInput.current?.focus()}
                style={styles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={addressInput}
                label="Siège social (facultatif)"
                info="Donnez l'adresse du siège social de votre structure si vous en avez"
                value={values.address}
                touched={touched.address}
                error={errors.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                onSubmitEditing={() => emailInput.current?.focus()}
                style={styles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={emailInput}
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
                onSubmitEditing={() => extraInput.current?.focus()}
                style={styles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={extraInput}
                label="Informations supplémentaires (facultatif)"
                info="Vous pouvez donner des informations supplémentaires sur la structure légale votre groupe. Ces informations seront publiques"
                multiline
                numberOfLines={3}
                value={values.extra}
                touched={touched.extra}
                error={errors.extra}
                onChangeText={handleChange('extra')}
                onBlur={handleBlur('extra')}
                onSubmitEditing={() => extraVerificationInput.current?.focus()}
                style={styles.textInput}
              />
            </View>
            <View style={[styles.container, { marginTop: 20 }]}>
              <Card
                elevation={0}
                style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
              >
                <View style={[styles.container, { flexDirection: 'row' }]}>
                  <Icon
                    name="shield-key-outline"
                    style={{ alignSelf: 'center', marginRight: 10 }}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={{ flex: 1 }}>
                    Les informations que vous donnez sur cette page ne seront pas modifiables sans
                    vérification. Vous devez vous assurer qu&apos;elles sont correctes. Nous pouvons
                    refuser un groupe si vous n&apos;avez pas donné assez de détails sur la
                    structure légale. {'\n'}
                    Vous devez aussi avoir connaissance des règles de modération définies dans les{' '}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        navigation.push('Root', {
                          screen: 'Main',
                          params: {
                            screen: 'More',
                            params: {
                              screen: 'About',
                              params: { screen: 'Legal', params: { page: 'conditions' } },
                            },
                          },
                        })
                      }
                    >
                      conditions d'utilisation
                    </Text>{' '}
                    avant de créer le groupe.{'\n'}
                    <Text style={{ fontWeight: 'bold' }}>
                      Toutes les informations ci-dessus seront affichées publiquement
                    </Text>
                  </Text>
                </View>
              </Card>
            </View>
            <View style={{ marginBottom: 20, marginTop: 40 }}>
              <FormTextInput
                ref={extraInput}
                label="Informations supplémentaires privées (facultatif)"
                info="Ces informations seront visibles uniquement à Topic. Si vous souhaitez avoir l'autorisation d'écrire les articles à d'autres échelles que la localisation que vous avez choisi, spécifiez le ici."
                multiline
                numberOfLines={6}
                value={values.extraVerification}
                touched={touched.extraVerification}
                error={errors.extraVerification}
                onChangeText={handleChange('extraVerification')}
                onBlur={handleBlur('extraVerification')}
                style={styles.textInput}
              />
            </View>
            <View style={styles.container}>
              <List.Item
                title="J'ai lu et j'accepte les conditions d'utilisation de Topic et je m'engage à écrire et modérer les contenus conformément à ces conditions"
                titleNumberOfLines={20}
                left={() =>
                  Platform.OS !== 'ios' ? (
                    <Checkbox
                      status={values.terms ? 'checked' : 'unchecked'}
                      color={colors.primary}
                    />
                  ) : null
                }
                right={() =>
                  Platform.OS === 'ios' ? (
                    <Checkbox
                      status={values.terms ? 'checked' : 'unchecked'}
                      color={colors.primary}
                    />
                  ) : null
                }
                onPress={() => setFieldValue('terms', !values.terms, true)}
              />
              <List.Item
                title="Je confirme que toutes les informations que j'ai donné sur ce groupe sont correctes, et que j'ai l'autorisation de créer ce groupe"
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
              <HelperText type="error" visible={!!(errors.terms || errors.correct)}>
                {errors.terms || errors.correct}
              </HelperText>
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
                onPress={() => handleSubmit()}
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
  const { groupData, groups } = state;
  return { creationData: groupData.creationData, state: groups.state };
};

export default connect(mapStateToProps)(ArticleAddPageProof);
