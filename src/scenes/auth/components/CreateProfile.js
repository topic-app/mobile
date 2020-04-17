import React from 'react';
import { View, Platform } from 'react-native';
import { Text, TextInput, HelperText, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import { updateCreationData } from '../../../redux/actions/account';

import { styles, colors } from '../../../styles/Styles';
import { theme } from '../../../styles/Theme';
import { authStyles } from '../styles/Styles';

class AuthCreatePageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      firstnameError: false,
      firstnameValid: true,
      firstnameErrorMessage: '',
      lastname: '',
      lastnameError: false,
      lastnameValid: true,
      lastnameErrorMessage: '',
    };
    this.emailRef = React.createRef();
  }

  validateFirstnameInput = () => {
    const { firstname } = this.state;
    if (firstname !== '') {
      if (firstname.match(/^[a-zA-Z0-9_ ]*$/i) === null) {
        this.setState({
          firstnameValid: false,
          firstnameError: true,
          firstnameErrorMessage: 'Votre prénom ne peut pas contenir de caractères spéciaux',
        });
      } else {
        this.setState({ firstnameValid: true, firstnameError: false, firstnameErrorMessage: '' });
      }
    } else {
      this.setState({ firstnameValid: false, firstnameError: false });
    }
  };

  preValidateFirstnameInput = () => {
    const { firstname } = this.state;
    if (firstname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      this.setState({ firstnameValid: false, firstnameError: false });
    }
  };

  validateLastnameInput = () => {
    const { lastname } = this.state;
    if (lastname !== '') {
      if (lastname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) === null) {
        this.setState({
          lastnameValid: false,
          lastnameError: true,
          lastnameErrorMessage: 'Votre nom ne peut pas contenir de caractères spéciaux',
        });
      } else {
        this.setState({ lastnameValid: true, lastnameError: false });
      }
    } else {
      this.setState({ lastnameValid: false, lastnameError: false });
    }
  };

  preValidateLastnameInput = () => {
    const { lastname } = this.state;
    if (lastname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      this.setState({ lastnameValid: true, lastnameError: false });
    }
  };

  submit = async () => {
    const { firstnameValid, firstname, lastnameValid, lastname } = this.state;

    const { forward } = this.props;

    await this.firstnameInput.blur();
    await this.lastnameInput.blur();
    await this.validateFirstnameInput();
    await this.validateLastnameInput();
    if ((firstnameValid || !firstname) && (lastnameValid || !lastname)) {
      updateCreationData({ firstname, lastname });
      forward();
    }
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

    const { backward } = this.props;

    return (
      <View style={authStyles.formContainer}>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={(firstnameInput) => {
              this.firstnameInput = firstnameInput;
            }}
            label="Prénom (facultatif)"
            value={firstname}
            error={firstnameError}
            autoCompleteType="name"
            onSubmitEditing={() => {
              this.validateFirstnameInput();
              this.lastnameInput.focus();
            }}
            autoFocus
            theme={
              firstnameValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            mode="outlined"
            onEndEditing={this.validateUsernameInput}
            textContentType="givenName"
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ firstname: text });
              this.preValidateFirstnameInput();
            }}
          />
          <HelperText type="error" visible={firstnameError}>
            {firstnameErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={(lastnameInput) => {
              this.lastnameInput = lastnameInput;
            }}
            label="Nom (facultatif)"
            value={lastname}
            error={lastnameError}
            autoCompleteType="email"
            onSubmitEditing={() => {
              this.validateLastnameInput();
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
            onEndEditing={this.validateEmailInput}
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ lastname: text });
              this.preValidateLastnameInput();
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

export default AuthCreatePageProfile;

AuthCreatePageProfile.propTypes = {
  forward: PropTypes.func.isRequired,
  backward: PropTypes.func.isRequired,
};
