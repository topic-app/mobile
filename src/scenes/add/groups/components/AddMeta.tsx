import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import * as Yup from 'yup';

import { StepperViewPageProps, FormTextInput } from '@components';
import { updateGroupCreationData } from '@redux/actions/contentData/groups';

import getStyles from '../styles';

type Props = StepperViewPageProps;

const ArticleAddPageMeta: React.FC<Props> = ({ next, prev }) => {
  const nameInput = createRef<RNTextInput>();
  const shortNameInput = createRef<RNTextInput>();
  const summaryInput = createRef<RNTextInput>();
  const descriptionInput = createRef<RNTextInput>();

  const theme = useTheme();
  const styles = getStyles(theme);

  const MetaSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Le nom doit contenir au moins 3 charactères')
      .max(100, 'Le nom doit contenir moins de 100 caractères.')
      .required('Nom requis'),
    shortName: Yup.string()
      .min(2, "L'acronyme doit contenir au moins 2 caractères")
      .max(20, "L'acronyme doit contenir moins de 20 caractères"),
    summary: Yup.string()
      .max(200, 'La description courte doit contenir moins de 200 caractères.')
      .required('Description courte requise'),
    description: Yup.string(),
  });

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{ name: '', shortName: '', summary: '', description: '' }}
        validationSchema={MetaSchema}
        onSubmit={({ name, shortName, summary, description }) => {
          updateGroupCreationData({
            name,
            shortName,
            summary,
            description,
          });
          next();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={nameInput}
                label="Nom du groupe"
                info="Donnez un nom reconnaissable à votre groupe, sans abréviation ou acronyme. Pour des raisons de sécurité, vous devrez nous contacter pour changer le nom du groupe après sa création."
                value={values.name}
                touched={touched.name}
                error={errors.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                onSubmitEditing={() => shortNameInput.current?.focus()}
                style={styles.textInput}
                autoFocus
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={shortNameInput}
                label="Acronyme ou abréviation (facultatif)"
                info="Acronyme ou abréviation reconnaissable, qui sera affichée en priorité sur vos contenus"
                value={values.shortName}
                touched={touched.shortName}
                error={errors.shortName}
                onChangeText={handleChange('shortName')}
                onBlur={handleBlur('shortName')}
                onSubmitEditing={() => summaryInput.current?.focus()}
                style={styles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={summaryInput}
                label="Description courte"
                info="Décrivez votre groupe en une ou deux phrases"
                multiline
                numberOfLines={3}
                value={values.summary}
                touched={touched.summary}
                error={errors.summary}
                onChangeText={handleChange('summary')}
                onBlur={handleBlur('summary')}
                onSubmitEditing={() => descriptionInput.current?.focus()}
                style={styles.textInput}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormTextInput
                ref={descriptionInput}
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

export default ArticleAddPageMeta;
