import React from 'react';
import { View, Platform } from 'react-native';
import { TextInput, HelperText, Button, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import { updateCreationData, updateState } from '@redux/actions/account';

import getAuthStyles from '../styles/Styles';

class AuthCreatePageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      firstnameError: false,
      firstnameValid: false,
      firstnameErrorMessage: '',
      lastname: '',
      lastnameError: false,
      lastnameValid: false,
      lastnameErrorMessage: '',
    };

    this.firstnameInput = React.createRef();
    this.lastnameInput = React.createRef();
  }

  validateFirstnameInput = async (firstname) => {
    let validation = { firstnameValid: false, firstnameError: false };
    if (firstname !== '') {
      if (firstname.match(/^[a-zA-Z0-9_ ]*$/i) === null) {
        validation = {
          firstnameValid: false,
          firstnameError: true,
          firstnameErrorMessage: 'Votre prénom ne peut pas contenir de caractères spéciaux',
        };
      } else {
        validation = { firstnameValid: true, firstnameError: false, firstnameErrorMessage: '' };
      }
    }

    this.setState(validation);
    return validation;
  };

  preValidateFirstnameInput = async (firstname) => {
    if (firstname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      this.setState({ firstnameValid: false, firstnameError: false });
    }
  };

  validateLastnameInput = async (lastname) => {
    let validation = { lastnameValid: false, lastnameError: false };
    if (lastname !== '') {
      if (lastname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) === null) {
        validation = {
          lastnameValid: false,
          lastnameError: true,
          lastnameErrorMessage: 'Votre nom ne peut pas contenir de caractères spéciaux',
        };
      } else {
        validation = { lastnameValid: true, lastnameError: false };
      }
    }

    this.setState(validation);
    return validation;
  };

  preValidateLastnameInput = async (lastname) => {
    if (lastname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      this.setState({ lastnameValid: true, lastnameError: false });
    }
  };

  blurInputs = async () => {
    this.firstnameInput.current.blur();
    this.lastnameInput.current.blur();
  };

  submit = async () => {
    updateState({ loading: true }); // Do we need this anymore?
    const { forward } = this.props;

    const firstname = this.firstnameInput.current.state.value;
    const lastname = this.lastnameInput.current.state.value;
    const { firstnameValid } = await this.validateFirstnameInput(firstname);
    const { lastnameValid } = await this.validateLastnameInput(lastname);
    if ((firstnameValid || !firstname) && (lastnameValid || !lastname)) {
      updateCreationData({ firstname, lastname });
      forward();
      this.blurInputs();
    }

    updateState({ loading: false }); // Do we need this anymore?
  };

  render() {
    const {
      firstname,
      firstnameValid,
      firstnameError,
      firstnameErrorMessage,
      lastname,
      lastnameValid,
      lastnameError,
      lastnameErrorMessage,
    } = this.state;

    const { backward, theme } = this.props;

    const { colors } = theme;
    const authStyles = getAuthStyles(theme);

    return (
      <View style={authStyles.formContainer}>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={this.firstnameInput}
            label="Prénom (facultatif)"
            value={firstname}
            error={firstnameError}
            autoCompleteType="name"
            disableFullscreenUI
            onSubmitEditing={(info) => {
              this.validateFirstnameInput(info.nativeEvent.text);
              this.lastnameInput.current.focus();
            }}
            autoFocus
            theme={
              firstnameValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            mode="outlined"
            onEndEditing={(info) => {
              this.validateFirstnameInput(info.nativeEvent.text);
            }}
            textContentType="givenName"
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ firstname: text });
              this.preValidateFirstnameInput(text);
            }}
          />
          <HelperText type="error" visible={firstnameError}>
            {firstnameErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={this.lastnameInput}
            label="Nom (facultatif)"
            value={lastname}
            error={lastnameError}
            autoCompleteType="email"
            disableFullscreenUI
            onSubmitEditing={(info) => {
              this.validateLastnameInput(info.nativeEvent.text);
              this.submit();
            }}
            autoCorrect={false}
            theme={
              lastnameValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            textContentType="emailAddress"
            mode="outlined"
            onEndEditing={(info) => {
              this.validateLastnameInput(info.nativeEvent.text);
            }}
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ lastname: text });
              this.preValidateLastnameInput(text);
            }}
          />
          <HelperText type="error" visible={lastnameError}>
            {lastnameErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              backward();
            }}
            style={{ flex: 1, marginRight: 5 }}
          >
            Retour
          </Button>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              this.submit();
            }}
            style={{ flex: 1, marginLeft: 5 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    );
  }
}

export default withTheme(AuthCreatePageProfile);

AuthCreatePageProfile.propTypes = {
  forward: PropTypes.func.isRequired,
  backward: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
