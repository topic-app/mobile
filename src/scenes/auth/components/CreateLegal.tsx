import React, { useState } from 'react';
import { View, Platform, Linking, TouchableWithoutFeedback } from 'react-native';
import { HelperText, Button, Checkbox, List, useTheme } from 'react-native-paper';

import { StepperViewPageProps } from '@components/index';

import getAuthStyles from '../styles/Styles';
import { ListHeading, ListItem, ListItemAnchor } from './ListComponents';

type Props = StepperViewPageProps & {
  create: () => void;
  userEmail?: string;
};

const AuthCreatePageLegal: React.FC<Props> = ({ prev, userEmail, create }) => {
  const [terms, setTerms] = useState(false);
  const [email, setEmail] = useState(false);
  const [termsError, setTermsError] = useState({ error: false, message: '' });
  const [emailError, setEmailError] = useState({ error: false, message: '' });

  const submit = () => {
    if (!terms) {
      setTermsError({ error: true, message: 'Vous devez accepter pour pouvoir continuer' });
    } else {
      setTermsError({ ...termsError, error: false });
    }
    if (!email) {
      setEmailError({ error: true, message: 'Vous devez confirmer pour pouvoir continuer' });
    } else {
      setEmailError({ ...termsError, error: false });
    }
    if (terms && email) {
      create();
    }
  };

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  return (
    <View style={authStyles.formContainer}>
      <View style={authStyles.descriptionContainer}>
        <View>
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL('https://beta.topicapp.fr/legal/privacy')}
          >
            <View style={authStyles.descriptionPartContainer}>
              <ListHeading label="Résumé de la politique de vie privée" />
              <ListItem
                icon="check"
                label="Nous collectons seulement les informations que vous nous donnez explicitement"
              />
              <ListItem
                icon="check"
                label="Nous partageons vos données seulement avec des organismes éducatifs"
              />
              <ListItem
                icon="check"
                label="Vos données restent en Europe et sont soumises aux lois françaises"
              />
              <ListItem
                icon="check"
                label="Vous pouvez supprimer votre compte et exercer vos droits à tout moment via l'onglet Profil"
              />
              <ListItem icon="close" label="Vos données ne sont pas vendues" />
              <ListItem
                icon="close"
                label="Vos données ne sont pas gardées quand elles ne sont plus nécéssaires"
              />
              <ListItem
                icon="information-outline"
                label="Pour plus d'informations, adressez vous à dpo@topicapp.fr"
              />
              <ListItemAnchor
                onPress={() => Linking.openURL('https://beta.topicapp.fr/legal/privacy')}
                icon="arrow-right-bold-circle-outline"
                label="Voir la politique de vie privée"
                textStyle={{ color: colors.primary, textDecorationLine: 'underline' }}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL('https://beta.topicapp.fr/legal/terms/')}
          >
            <View style={authStyles.descriptionPartContainer}>
              <ListHeading label="Résumé des conditions d'utilisation" />
              <ListItem
                icon="close"
                label="Toute forme de violence, de harcèlement, ou de haine est formellement interdite"
              />
              <ListItem
                icon="close"
                label="Le contenu que vous publiez doit être approprié pour des enfants de tous ages"
              />
              <ListItem
                icon="alert-outline"
                label="En cas de contenu illicite ou inapproprié, nous en informerons les instances telles que la police"
              />
              <ListItem
                icon="alert-outline"
                label="En cas de non respect de ces conditions, votre compte peut etre supprimé"
              />
              <ListItem
                icon="information-outline"
                label="Vous pouvez reporter un contenu qui contrevient à ces conditions"
              />
              <ListItem
                icon="information-outline"
                label="Nous déclinons toute responsabilité en cas de problème"
              />
              <ListItem
                icon="information-outline"
                label="Si vous etes mineur, votre représentant légal doit accepter les conditions d'utilisation et la politique de vie privée aussi"
              />
              <ListItemAnchor
                onPress={() => Linking.openURL('https://beta.topicapp.fr/legal/terms/')}
                icon="arrow-right-bold-circle-outline"
                label="Voir les conditions d'utilisation"
                textStyle={{ color: colors.primary, textDecorationLine: 'underline' }}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={authStyles.descriptionPartContainer}>
            <ListItem
              icon="information-outline"
              label="Ces résumés n'ont aucune valeur légale et ne remplacent pas les conditions d'utilisation et la politique de vie privée"
              textStyle={{ fontWeight: 'bold' }}
            />
          </View>
        </View>
        <View>
          <List.Item
            title="J'accepte les conditions d'utilisation et la politique de vie privée"
            titleNumberOfLines={10}
            left={() =>
              Platform.OS !== 'ios' ? (
                <Checkbox status={terms ? 'checked' : 'unchecked'} color={colors.primary} />
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <Checkbox status={terms ? 'checked' : 'unchecked'} color={colors.primary} />
              ) : null
            }
            onPress={() => setTerms(!terms)}
          />
          <List.Item
            title={`Je confirme que mon adresse mail est bien ${userEmail ?? ''}`}
            titleNumberOfLines={10}
            left={() =>
              Platform.OS !== 'ios' ? (
                <Checkbox status={email ? 'checked' : 'unchecked'} color={colors.primary} />
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <Checkbox status={email ? 'checked' : 'unchecked'} color={colors.primary} />
              ) : null
            }
            onPress={() => setEmail(!email)}
          />
          <HelperText type="error" visible={emailError.error || termsError.error}>
            {termsError.error ? termsError.message : emailError.message}
          </HelperText>
        </View>
        <View style={authStyles.buttonContainer}>
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
            onPress={submit}
            style={{ flex: 1, marginLeft: 5 }}
          >
            Créer mon compte
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AuthCreatePageLegal;
