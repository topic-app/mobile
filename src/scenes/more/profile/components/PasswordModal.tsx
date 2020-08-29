import React from "react";
import { ModalProps, State, Account } from "@ts/types";
import {
  Divider,
  Button,
  HelperText,
  ProgressBar,
  ThemeProvider,
  Card,
  useTheme,
} from "react-native-paper";
import { View, Platform, TextInput, Alert } from "react-native";
import { BottomModal, SlideAnimation } from '@components/Modals';
import { connect } from "react-redux";

import { CollapsibleView, ErrorMessage } from "@components/index";
import getStyles from "@styles/Styles";
import { updatePassword } from "@redux/actions/data/profile";
import { fetchAccount } from "@redux/actions/data/account";
import getArticleStyles from "../styles/Styles";
// import LocalAuthentication from 'rn-local-authentication';

type PasswordModalProps = ModalProps & {
  state: { updateProfile: { loading: boolean; error: any } };
};

function PasswordModal({ visible, setVisible, state }: PasswordModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const profileStyles = getArticleStyles(theme);
  const { colors } = theme;

  const passwordInput = React.useRef(null);

  const [passwordValidation, setValidation] = React.useState({
    valid: false,
    error: false,
    message: "",
  });

  function validatePasswordInput(password: string) {
    let validation: { valid: boolean; error: any; message?: string } = {
      valid: false,
      error: false,
    };

    if (password !== "") {
      if (password.length < 8) {
        validation = {
          valid: false,
          error: true,
          message: "Le mot de passe doit contenir au moins 8 caractères",
        };
      } else if (
        password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) === null
      ) {
        validation = {
          valid: false,
          error: true,
          message:
            "Le mot de passe doit contenir au moins un chiffre, une minuscule et une majuscule",
        };
      } else {
        validation = { valid: true, error: false };
      }
    }

    setValidation(validation);
    return validation;
  }

  function preValidatePasswordInput(password: string) {
    if (
      password.length >= 8 &&
      password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) !== null
    ) {
      setValidation({ valid: false, error: false, message: "" });
    }
  }

  const [password, setPassword] = React.useState("");

  const update = async () => {
    const passwordValidation = validatePasswordInput(password);
    if (passwordValidation.valid) {
      if (await LocalAuthentication.isSupportedAsync()) {
        LocalAuthentication.authenticateAsync({
          reason: "Topic App - Changer le mot de passe",
          title: "Authentification",
          fallbackEnabled: true,
          fallbackToPinCodeAction: true,
        }).then((result) => {
          if (result.success) {
            updatePassword(password).then(() => {
              setPassword("");
              setVisible(false);
              fetchAccount();
            });
          } else {
            Alert.alert(
              "Erreur lors de l'authentification",
              "Vous pouvez toujours changer le mot de passe depuis l'interface web."
            );
          }
        });
      } else {
        updatePassword(password).then(() => {
          setPassword("");
          setVisible(false);
          fetchAccount();
        });
      }
    } else {
      passwordInput.current?.focus();
    }
  };

  return (
    <BottomModal
      visible={visible}
      onTouchOutside={() => {
        setVisible(false);
      }}
      onHardwareBackPress={() => {
        setVisible(false);
        return true;
      }}
      onSwipeOut={() => {
        setVisible(false);
      }}
      modalAnimation={
        new SlideAnimation({
          slideFrom: "bottom",
          useNativeDriver: false,
        })
      }
    >
      <ThemeProvider theme={theme}>
        <Card style={styles.modalCard}>
          {state.updateProfile.loading && <ProgressBar indeterminate />}
          {state.updateProfile.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: "la modification du compte",
                contentSingular: "Le compte",
              }}
              error={state.updateProfile.error}
              retry={update}
            />
          )}
          <View>
            <View style={profileStyles.inputContainer}>
              <TextInput
                ref={passwordInput}
                autoFocus
                disableFullscreenUI
                autoCorrect={false}
                secureTextEntry
                textContentType="password"
                autoCompleteType="password"
                placeholder="Nouveau mot de passe"
                placeholderTextColor={colors.disabled}
                style={profileStyles.borderlessInput}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  preValidatePasswordInput(text);
                }}
                onSubmitEditing={update}
              />
              <CollapsibleView collapsed={!passwordValidation.error}>
                <HelperText type="error" visible>
                  {passwordValidation.message}
                </HelperText>
              </CollapsibleView>
            </View>
            <Divider />
            <View style={styles.contentContainer}>
              <Button
                mode={Platform.OS === "ios" ? "outlined" : "contained"}
                color={colors.primary}
                uppercase={Platform.OS !== "ios"}
                onPress={update}
              >
                Confirmer
              </Button>
            </View>
          </View>
        </Card>
      </ThemeProvider>
    </BottomModal>
  );
}

const mapStateToProps = (state: State) => {
  const { account } = state;
  return {
    state: account.state,
  };
};

export default connect(mapStateToProps)(PasswordModal);
