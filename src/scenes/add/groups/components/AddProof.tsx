import { Formik } from 'formik';
import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, HelperText, Button, ProgressBar, Checkbox, List } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, ErrorMessage, FormTextInput } from '@components/index';
import { groupAdd } from '@redux/actions/apiActions/groups';
import { clearGroupCreationData } from '@redux/actions/contentData/groups';
import { State, GroupRequestState, GroupCreationData } from '@ts/types';
import { useTheme } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  creationData: GroupCreationData;
  state: GroupRequestState;
  navigation: any;
};

const ArticleAddPageProof: React.FC<Props> = ({ next, prev, creationData, state, navigation }) => {
  const nameInput = createRef<RNTestInput>();
  const idInput = createRef<RNTestInput>();
  const adminInput = createRef<RNTestInput>();
  const addressInput = createRef<RNTestInput>();
  const emailInput = createRef<RNTestInput>();
  const websiteInput = createRef<RNTestInput>();
  const extraInput = createRef<RNTestInput>();
  const extraVerificationInput = createRef<RNTestInput>();

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
    email: Yup.string().email().required('Email requis'),
    website: Yup.string().url().max(200, 'Le site web doit contenir moins de 200 caractères'),
    extra: Yup.string().max(
      1000,
      'Les données supplémentaires ne doivent pas dépasser 1000 caractères',
    ),
    extraVerification: Yup.string().max(
      10000,
      'Les données supplémentaires ne doivent pas dépasser 10000 caractères',
    ),
  });

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getArticleStyles(theme);

  return (
    <View style={articleStyles.formContainer}>
      <Formik
        initialValues={{
          name: '',
          id: '',
          admin: '',
          address: '',
          email: '',
          website: '',
          extra: '',
          extraVerification: '',
        }}
        validationSchema={MetaSchema}
        onSubmit={({ name, id, admin, address, email, website, extra, extraVerification }) => {
          groupAdd({
            name: creationData.name,
            shortName: creationData.shortName,
            summary: creationData.summary,
            location: creationData.location,
            type: creationData.type,
            parser: 'markdown',
            description: creationData.description,
            legal: {
              name,
              id,
              admin,
              address,
              email,
              website,
              extra,
            },
            verification: {
              name,
              id,
              extra: extraVerification,
            },
          }).then(({ _id }) => {
            navigation.replace('Success', { id: _id, creationData });
            clearGroupCreationData();
          });
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            {state.add?.loading ? <ProgressBar indeterminate /> : <View style={{ height: 4 }} />}
            {state.add?.success === false && (
              <ErrorMessage
                error={state.add?.error}
                strings={{
                  what: "l'ajout du groupe",
                  contentSingular: 'Le groupe',
                  contentPlural: 'de groupes (5 maximum)',
                }}
                type="axios"
                retry={() => handleSubmit()}
              />
            )}
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={nameInput}
                label="Nom exact de l'entité légale (facultatif)"
                info="Si vous êtes une association ou une autre entité légale, donnez le nom complet tel qu'il apparait dans les publications officielles (Journal Officiel etc). Si vous n'avez pas de structure légale, laissez vide. Ce nom sera affiché publiquement."
                value={values.name}
                touched={touched.name}
                error={errors.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                onSubmitEditing={() => idInput.current?.focus()}
                style={articleStyles.textInput}
                autoFocus
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={idInput}
                label="Identifiant (facultatif)"
                info="Si vous êtes une entité légale, donnez votre RNA, SIRET, ou DUNS, sous la forme SIRET:88483577800017 par exemple. Le numéro sera affiché publiquement."
                value={values.id}
                touched={touched.id}
                error={errors.id}
                onChangeText={handleChange('id')}
                onBlur={handleBlur('id')}
                onSubmitEditing={() => adminInput.current?.focus()}
                style={articleStyles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={adminInput}
                label="Responsable légal"
                info="Donnez le nom complet du responsable légal de votre groupe, ou de vous-même si le groupe n'a pas de structure légale. Assurez vous que vous avez bien l'autorisation de la personne concernée avant de rentrer son nom. Le nom doit être complet, tel qu'il apparait sur les documents légaux (passport, carte d'identité). Ce nom sera affiché publiquement."
                value={values.admin}
                touched={touched.admin}
                error={errors.admin}
                onChangeText={handleChange('admin')}
                onBlur={handleBlur('admin')}
                onSubmitEditing={() => addressInput.current?.focus()}
                style={articleStyles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={addressInput}
                label="Siège social (facultatif)"
                info="Donnez l'adresse du siège social de votre structure, ou votre propre adresse si il n'y a pas de structure légale. Le siège social sera affiché publiquement."
                value={values.address}
                touched={touched.address}
                error={errors.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                onSubmitEditing={() => emailInput.current?.focus()}
                style={articleStyles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={emailInput}
                label="Adresse email"
                info="Donnez une adresse email par laquelle les gens pourront vous contacter. Cet email sera vérifié et sera affiché publiquement."
                value={values.email}
                touched={touched.email}
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCompleteType="email"
                error={errors.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                onSubmitEditing={() => websiteInput.current?.focus()}
                style={articleStyles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={websiteInput}
                label="Site web (facultatif)"
                info="Donnez l'url du site web de votre structure, si vous en avez un. Ce site sera affiché publiquement."
                textContentType="URL"
                keyboardType="url"
                value={values.website}
                touched={touched.website}
                error={errors.website}
                onChangeText={handleChange('website')}
                onBlur={handleBlur('website')}
                onSubmitEditing={() => addressInput.current?.focus()}
                style={articleStyles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={extraInput}
                label="Informations supplémentaires publiques (facultatif)"
                info="Donnez des informations supplémentaires sur la structure légale votre groupe. Ces informations seront publiques."
                multiline
                numberOfLines={6}
                value={values.extra}
                touched={touched.extra}
                error={errors.extra}
                onChangeText={handleChange('extra')}
                onBlur={handleBlur('extra')}
                onSubmitEditing={() => extraVerificationInput.current?.focus()}
                style={articleStyles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={extraInput}
                label="Informations supplémentaires privées (facultatif)"
                info="Donnez des informations supplémentaires sur la structure légale votre groupe. Ces informations seront visibles uniquement à Topic."
                multiline
                numberOfLines={6}
                value={values.extraVerification}
                touched={touched.extraVerification}
                error={errors.extraVerification}
                onChangeText={handleChange('extraVerification')}
                onBlur={handleBlur('extraVerification')}
                style={articleStyles.textInput}
              />
            </View>
            <View style={articleStyles.buttonContainer}>
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
