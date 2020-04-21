import React from 'react';
import { View, Platform, Linking } from 'react-native';
import { HelperText, Button, Checkbox, List, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getAuthStyles from '../styles/Styles';

import { ListHeading, ListItem, ListItemAnchor } from './ListComponents';

class AuthCreatePageLegal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: false,
      error: false,
      errorMessage: '',
      email: false,
      emailError: false,
      emailErrorMessage: '',
    };
  }

  submit = () => {
    const { create } = this.props;
    const { terms, email } = this.state;
    if (!terms) {
      this.setState({ error: true, errorMessage: 'Vous devez accepter pour pouvoir continuer' });
    } else {
      this.setState({ error: false });
    }
    if (!email) {
      this.setState({
        emailError: true,
        emailErrorMessage: 'Vous devez confirmer pour pouvoir continuer',
      });
    } else {
      this.setState({
        emailError: false,
      });
    }
    if (terms && email) {
      create();
    }
  };

  render() {
    const { terms, error, errorMessage, email, emailError, emailErrorMessage } = this.state;
    const { backward, creationData, theme } = this.props;
    const { colors } = theme;
    const authStyles = getAuthStyles(theme);

    return (
      <View style={authStyles.formContainer}>
        <View style={authStyles.descriptionContainer}>
          <View>
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
                label="Pour plus d'informations addressez vous à dpo@topicapp.fr"
              />
              <ListItemAnchor
                icon="arrow-right-bold-circle-outline"
                label="Voir la politique de vie privée"
                onPress={() => Linking.openURL('https://topicapp.fr/legal/privacy')}
              />
            </View>
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
                label="En cas de contenu illicite ou inapproprié, nous en informerons les instances telles que votre école ou la police"
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
                label="Nous déclinons toute responsabilité en cas de problème"
              />
              <ListItemAnchor
                icon="arrow-right-bold-circle-outline"
                label="Voir les conditions d'utilisation"
                onPress={() => Linking.openURL('https://topicapp.fr/legal/terms/')}
              />
            </View>
          </View>
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
            onPress={() => this.setState({ terms: !terms })}
          />
          <List.Item
            title={`Je confirme que mon addresse mail est bien ${
              creationData ? creationData.email : ''
            }`}
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
            onPress={() => this.setState({ email: !email })}
          />
          <HelperText type="error" visible={emailError || error}>
            {error ? errorMessage : emailErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => backward()}
            style={{ flex: 1, marginRight: 5 }}
          >
            Retour
          </Button>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => this.submit()}
            style={{ flex: 1, marginLeft: 5 }}
          >
            Créer mon compte
          </Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { account } = state;
  return { creationData: account.creationData };
};

export default connect(mapStateToProps)(withTheme(AuthCreatePageLegal));

AuthCreatePageLegal.defaultProps = {
  creationData: {
    email: '',
  },
};

AuthCreatePageLegal.propTypes = {
  create: PropTypes.func.isRequired,
  backward: PropTypes.func.isRequired,
  creationData: PropTypes.shape({
    email: PropTypes.string,
  }),
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};