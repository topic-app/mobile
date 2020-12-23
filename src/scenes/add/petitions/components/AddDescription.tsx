import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTextInput } from 'react-native';
import { TextInput, HelperText, Button } from 'react-native-paper';

import { StepperViewPageProps } from '@components/index';
import { updateCreationData, updateState } from '@redux/actions/data/account';
import { useTheme, request } from '@utils/index';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps;

const AuthCreatePageGeneral: React.FC<Props> = ({ next }) => {
  const usernameInput = createRef<RNTextInput>();
  const emailInput = createRef<RNTextInput>();
  const passwordInput = createRef<RNTextInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempUsername: InputStateType;
  let tempEmail: InputStateType;
  let tempPassword: InputStateType;

  const [currentUsername, setCurrentUsername] = useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [currentEmail, setCurrentEmail] = useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [currentPassword, setCurrentPassword] = useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  function setUsername(data: Partial<InputStateType>) {
    // Étant donné que définir le state est asynchrone,
    // si setUsername est appelé deux fois rapidement, un nom
    // d'utilisateur peut possiblement remplacer un autre,
    // nous devons donc utiliser une variable temporaire
    tempUsername = { ...currentUsername, ...(tempUsername ?? {}), ...data };
    setCurrentUsername(tempUsername);
  }
  function setEmail(data: Partial<InputStateType>) {
    tempEmail = { ...currentEmail, ...(tempEmail ?? {}), ...data };
    setCurrentEmail(tempEmail);
  }
  function setPassword(data: Partial<InputStateType>) {
    tempPassword = { ...currentPassword, ...(tempPassword ?? {}), ...data };
    setCurrentPassword(tempPassword);
  }

  async function validateUsernameInput(username: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (username !== '') {
      if (username.length < 3) {
        validation = {
          valid: false,
          error: true,
          message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
        };
      } else if (username.match(/^[a-zA-Z0-9_.]+$/i) === null) {
        validation = {
          valid: false,
          error: true,
          message:
            "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . »",
        };
      } else {
        let result;
        try {
          result = await request('auth/check/local/username', 'get', { username });
        } catch (err) {
          updateState({ check: { success: false, error: err, loading: false } });
        }
        if (result?.data?.usernameExists === false) {
          validation = { valid: true, error: false };
        } else {
          validation = {
            valid: false,
            error: true,
            message: "Ce nom d'utilisateur existe déjà",
          };
        }
      }
    }
    setUsername(validation);
    return validation;
  }

  function preValidateUsernameInput(username: string) {
    if (username.length >= 3 && username.match(/^[a-zA-Z0-9_.]+$/i) !== null) {
      setUsername({ valid: false, error: false });
    }
  }

  async function validateEmailInput(email: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (email !== '') {
      if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) === null) {
        validation = {
          valid: false,
          error: true,
          message: 'Adresse mail incorrecte',
        };
      } else {
        let result;
        try {
          result = await request('auth/check/local/email', 'get', { email });
        } catch (err) {
          updateState({ check: { success: false, error: err, loading: false } });
        }
        if (result?.data?.emailExists === false) {
          validation = { valid: true, error: false };
        } else {
          validation = {
            valid: false,
            error: true,
            message: 'Cette adresse email à déjà été utilisée',
          };
        }
      }
    }

    setEmail(validation);
    return validation;
  }

  function preValidateEmailInput(email: string) {
    if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) !== null) {
      // TODO: Change to emailExists once server is updated
      setEmail({ valid: false, error: false });
    }
  }

  function validatePasswordInput(password: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (password !== '') {
      if (password.length < 8) {
        validation = {
          valid: false,
          error: true,
          message: 'Le mot de passe doit contenir au moins 8 caractères.',
        };
      } else if (password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) === null) {
        validation = {
          valid: false,
          error: true,
          message:
            'Le mot de passe doit contenir au moins un chiffre, une minuscule et une majuscule.',
        };
      } else {
        validation = { valid: true, error: false };
      }
    }

    setPassword(validation);
    return validation;
  }

  function preValidatePasswordInput(password: string) {
    if (
      password.length >= 8 &&
      password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) !== null
    ) {
      setPassword({ valid: false, error: false });
    }
  }

  function blurInputs() {
    usernameInput.current?.blur();
    emailInput.current?.blur();
    passwordInput.current?.blur();
  }

  async function submit() {
    updateState({ check: { loading: true, success: null, error: null } });

    const usernameVal = currentUsername.value;
    const emailVal = currentEmail.value;
    const passwordVal = currentPassword.value;

    const username = await validateUsernameInput(usernameVal);
    const email = await validateEmailInput(emailVal);
    const password = validatePasswordInput(passwordVal);
    if (username.valid && email.valid && password.valid) {
      updateCreationData({ username: usernameVal, email: emailVal, password: passwordVal });
      next();
    } else {
      if (!username.valid && !username.error) {
        setUsername({
          valid: false,
          error: true,
          message: "Nom d'utilisateur requis",
        });
      }
      if (!email.valid && !email.error) {
        setEmail({
          valid: false,
          error: true,
          message: 'Adresse mail requise',
        });
      }
      if (!password.valid && !password.error) {
        setPassword({
          valid: false,
          error: true,
          message: 'Mot de passe requis',
        });
      }
    }
    updateState({ check: { loading: false, success: true, error: null } });
  }

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  return (
    <View style={authStyles.formContainer}>
      <View style={authStyles.textInputContainer}>
        <TextInput
          ref={usernameInput}
          label="Nom d'utilisateur"
          value={currentUsername.value}
          error={currentUsername.error}
          disableFullscreenUI
          autoCompleteType="username"
          onSubmitEditing={({ nativeEvent }) => {
            validateUsernameInput(nativeEvent.text);
            emailInput.current?.focus();
          }}
          autoCorrect={false}
          autoFocus
          theme={
            currentUsername.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateUsernameInput(nativeEvent.text);
          }}
          textContentType="username"
          style={authStyles.textInput}
          onChangeText={(text) => {
            setUsername({ value: text });
            preValidateUsernameInput(text);
          }}
        />
        <HelperText type="error" visible={currentUsername.error}>
          {currentUsername.message}
        </HelperText>
      </View>
      <View style={authStyles.textInputContainer}>
        <TextInput
          ref={emailInput}
          label="Email"
          value={currentEmail.value}
          error={currentEmail.error}
          disableFullscreenUI
          keyboardType="email-address"
          autoCompleteType="email"
          autoCapitalize="none"
          onSubmitEditing={({ nativeEvent }) => {
            validateEmailInput(nativeEvent.text);
            passwordInput.current?.focus();
          }}
          autoCorrect={false}
          theme={
            currentEmail.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          textContentType="emailAddress"
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateEmailInput(nativeEvent.text);
          }}
          style={authStyles.textInput}
          onChangeText={(text) => {
            setEmail({ value: text });
            preValidateEmailInput(text);
          }}
        />
        <HelperText type="error" visible={currentEmail.error}>
          {currentEmail.message}
        </HelperText>
      </View>
      <View style={authStyles.textInputContainer}>
        <TextInput
          ref={passwordInput}
          label="Mot de passe"
          returnKeyType="go"
          value={currentPassword.value}
          disableFullscreenUI
          error={currentPassword.error}
          mode="outlined"
          autoCorrect={false}
          secureTextEntry
          onSubmitEditing={({ nativeEvent }) => {
            validatePasswordInput(nativeEvent.text);
            blurInputs();
            submit();
          }}
          onEndEditing={({ nativeEvent }) => {
            validatePasswordInput(nativeEvent.text);
          }}
          textContentType="password"
          autoCompleteType="password"
          style={authStyles.textInput}
          onChangeText={(text) => {
            setPassword({ value: text });
            preValidatePasswordInput(text);
          }}
          theme={
            currentPassword.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
        />
        <HelperText type="error" visible={currentPassword.error}>
          {currentPassword.message}
        </HelperText>
      </View>
      <View style={authStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => {
            blurInputs();
            submit();
          }}
          style={{ flex: 1 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

export default AuthCreatePageGeneral;
