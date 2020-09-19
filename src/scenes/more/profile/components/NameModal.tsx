import React from "react";
import { ModalProps, State, Account } from "@ts/types";
import {
  Divider,
  Button,
  TextInput,
  Card,
  ThemeProvider,
  useTheme,
  ProgressBar,
} from "react-native-paper";
import { View, Platform } from "react-native";
import { connect } from "react-redux";
import { BottomModal, SlideAnimation } from '@components/Modals';

import getStyles from "@styles/Styles";
import { ErrorMessage } from "@components/index";
import { updateData } from "@redux/actions/data/profile";
import { fetchAccount } from "@redux/actions/data/account";
import getprofileStyles from "../styles/Styles";

type NameModalProps = ModalProps & {
  account: Account;
  state: { updateProfile: { loading: boolean; error: any } };
};

function NameModal({ visible, setVisible, account, state }: NameModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const profileStyles = getprofileStyles(theme);
  const { colors } = theme;

  const firstNameInputRef = React.useRef(null);
  const lastNameInputRef = React.useRef(null);

  const [firstName, setFirstName] = React.useState(
    account.accountInfo?.user?.data?.firstName
  );
  const [lastName, setLastName] = React.useState(
    account.accountInfo?.user?.data?.lastName
  );

  const update = () => {
    updateData({ firstName, lastName }).then(() => {
      setVisible(false);
      fetchAccount();
    });
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
          <View>
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
            <View style={{ marginHorizontal: 5, marginBottom: 10 }}>
              <View style={profileStyles.inputContainer}>
                <TextInput
                  ref={firstNameInputRef}
                  autoFocus
                  mode="outlined"
                  label="Prénom"
                  value={firstName}
                  onChangeText={setFirstName}
                  onSubmitEditing={() => lastNameInputRef.current?.focus()}
                />
              </View>
              <View style={profileStyles.inputContainer}>
                <TextInput
                  ref={lastNameInputRef}
                  mode="outlined"
                  label="Nom"
                  value={lastName}
                  onChangeText={setLastName}
                  onSubmitEditing={() => update()}
                />
              </View>
            </View>
            <Divider style={{ marginTop: 10 }} />
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
    account,
    state: account.state,
  };
};

export default connect(mapStateToProps)(NameModal);
