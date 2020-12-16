import { Formik } from 'formik';
import React, { useState } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { HelperText, Button, Checkbox, List } from 'react-native-paper';
import * as Yup from 'yup';

import { StepperViewPageProps } from '@components/index';
import { useTheme } from '@utils/index';

import getAuthStyles from '../styles/Styles';
import { ListHeading, ListItem, ListItemAnchor } from './ListComponents';

type Props = StepperViewPageProps & {
  create: () => void;
  userEmail?: string;
  navigation: any;
};

const AuthCreatePageLegal: React.FC<Props> = ({ prev, userEmail, create, navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  const LegalSchema = Yup.object().shape({
    terms: Yup.bool().oneOf([true], 'Vous devez accepter pour pouvoir continuer'),
    email: Yup.bool().oneOf([true], 'Vous devez confirmer pour pouvoir continuer'),
  });

  return (
    <View style={authStyles.formContainer}>
      <View style={authStyles.descriptionContainer}>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.push('Main', {
                screen: 'More',
                params: {
                  screen: 'About',
                  params: { screen: 'Legal', params: { page: 'confidentialite' } },
                },
              })
            }
          >
            <View style={authStyles.descriptionPartContainer}>
              <ListHeading label="Résumé de la politique de vie privée" />
              <ListItem
                icon="check"
                label="Nous collectons seulement les informations nécéssaires au bon fonctionnement du service ou au développement de celui-ci"
              />
              <ListItem
                icon="check"
                label="Nous partageons vos données privées le moins possible"
              />
              <ListItem
                icon="check"
                label="Vos données restent en Europe et sont soumises aux lois françaises"
              />
              <ListItem
                icon="check"
                label="Vous pouvez supprimer votre compte et exercer vos droits à tout moment via l'onglet Profil"
              />
              <ListItem
                icon="close"
                label="Vos données ne sont pas vendues, et nous n'utilisons pas de traçage publicitaire"
              />
              <ListItem
                icon="close"
                label="Vos données ne sont pas gardées quand elles ne sont plus nécéssaires"
              />
              <ListItem
                icon="information-outline"
                label="Pour plus d'informations, adressez vous à dpo@topicapp.fr"
              />
              <ListItemAnchor
                onPress={() =>
                  navigation.push('Main', {
                    screen: 'More',
                    params: {
                      screen: 'About',
                      params: { screen: 'Legal', params: { page: 'confidentialite' } },
                    },
                  })
                }
                icon="arrow-right-bold-circle-outline"
                label="Voir la politique de vie privée"
                textStyle={{ color: colors.primary, textDecorationLine: 'underline' }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.push('Main', {
                screen: 'More',
                params: {
                  screen: 'About',
                  params: { screen: 'Legal', params: { page: 'conditions' } },
                },
              })
            }
          >
            <View style={authStyles.descriptionPartContainer}>
              <ListHeading label="Résumé des conditions d'utilisation" />
              <ListItem
                icon="close"
                label="Toute forme de violence, de harcèlement, ou de haine est interdite"
              />
              <ListItem
                icon="close"
                label="Les contenus illégaux, explicites, trompeurs, malveillants, abusifs ou diffamatoires sont interdits"
              />
              <ListItem
                icon="close"
                label="Vous n'avez pas le droit d'interférer avec le fonctionnement des services ou de causer des dommages au service et aux autres utilisateurs"
              />
              <ListItem
                icon="alert-outline"
                label="En cas de non respect de ces conditions, votre compte peut etre supprimé ou votre accès à l'application restreint"
              />
              <ListItem
                icon="information-outline"
                label="Vous pouvez signaler un contenu qui contrevient à ces conditions"
              />
              <ListItem
                icon="information-outline"
                label="Nous déclinons toute responsabilité en cas de problème, et ne garantissons pas que le service fonctionne correctement"
              />
              <ListItem
                icon="information-outline"
                label="Si vous etes mineur, votre représentant légal doit accepter les conditions d'utilisation et la politique de vie privée aussi"
              />
              <ListItemAnchor
                onPress={() =>
                  navigation.push('Main', {
                    screen: 'More',
                    params: {
                      screen: 'About',
                      params: { screen: 'Legal', params: { page: 'conditions' } },
                    },
                  })
                }
                icon="arrow-right-bold-circle-outline"
                label="Voir les conditions d'utilisation"
                textStyle={{ color: colors.primary, textDecorationLine: 'underline' }}
              />
            </View>
          </TouchableOpacity>
          <View style={authStyles.descriptionPartContainer}>
            <ListItem
              icon="information-outline"
              label="Ces résumés n'ont aucune valeur légale et ne remplacent pas les conditions d'utilisation et la politique de vie privée"
              textStyle={{ fontWeight: 'bold' }}
            />
          </View>
        </View>
        <View>
          <Formik
            initialValues={{ terms: false, email: false }}
            validationSchema={LegalSchema}
            onSubmit={create}
          >
            {({ setFieldValue, handleSubmit, values, errors, touched }) => (
              <View>
                <List.Item
                  title="J'accepte les conditions d'utilisation et la politique de vie privée"
                  titleNumberOfLines={10}
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
                  onPress={() => setFieldValue('terms', !values.terms)}
                />
                <List.Item
                  title={`Je confirme que mon adresse mail est bien ${userEmail ?? ''}`}
                  titleNumberOfLines={10}
                  left={() =>
                    Platform.OS !== 'ios' ? (
                      <Checkbox
                        status={values.email ? 'checked' : 'unchecked'}
                        color={colors.primary}
                      />
                    ) : null
                  }
                  right={() =>
                    Platform.OS === 'ios' ? (
                      <Checkbox
                        status={values.email ? 'checked' : 'unchecked'}
                        color={colors.primary}
                      />
                    ) : null
                  }
                  onPress={() => setFieldValue('email', !values.email)}
                />
                <HelperText
                  type="error"
                  // If email has an error and email was touched then show the HelperText,
                  // do the same for terms
                  visible={(!!errors.email && touched.email) || (!!errors.terms && touched.terms)}
                >
                  {errors.email || errors.terms}
                </HelperText>
                <View style={authStyles.buttonContainer}>
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
                    style={{ flex: 1, marginLeft: 5 }}
                  >
                    Créer mon compte
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
};

export default AuthCreatePageLegal;
