import React from "react";
import { ModalProps, ArticleListItem } from "@ts/types";
import {
  Divider,
  Button,
  Card,
  RadioButton,
  List,
  ThemeProvider,
  useTheme,
  ProgressBar,
} from "react-native-paper";
import { View, Platform, FlatList } from "react-native";
import { ErrorMessage } from "@components/index";
import { BottomModal, SlideAnimation } from "react-native-modals";

import getStyles from "@styles/Styles";
import { updateData } from "@redux/actions/data/profile";
import { fetchAccount } from "@redux/actions/data/account";
import { connect } from "react-redux";

type VisibilityModalProps = ModalProps & {
  isInitialPublic: boolean;
  state: { updateProfile: { loading: boolean; error: any } };
};

function VisibilityModal({
  visible,
  setVisible,
  isInitialPublic,
  state,
}: VisibilityModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [isPublic, setPublic] = React.useState(isInitialPublic);

  const update = () => {
    updateData({
      public: isPublic,
      ...(!isPublic ? { firstName: "", lastName: "" } : {}),
    }).then(() => {
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
            <List.Item
              title="Compte public"
              description="Les autres utilisateurs peuvent voir votre école, votre nom, votre prénom et les groupes que vous suivez."
              onPress={() => {
                setPublic(true);
              }}
              left={() =>
                Platform.OS !== "ios" && (
                  <RadioButton
                    color={colors.primary}
                    status={isPublic ? "checked" : "unchecked"}
                    onPress={() => {
                      setPublic(true);
                    }}
                  />
                )
              }
              right={() =>
                Platform.OS === "ios" && (
                  <RadioButton
                    color={colors.primary}
                    status={isPublic ? "checked" : "unchecked"}
                    onPress={() => {
                      setPublic(true);
                    }}
                  />
                )
              }
            />
            <List.Item
              title="Compte privé"
              description="Les autres utilisateurs peuvent voir les groupes auquels vous appartenez. Vous ne pouvez pas être administrateur d'un groupe."
              onPress={() => {
                setPublic(false);
              }}
              left={() =>
                Platform.OS !== "ios" && (
                  <RadioButton
                    color={colors.primary}
                    status={!isPublic ? "checked" : "unchecked"}
                    onPress={() => {
                      setPublic(false);
                    }}
                  />
                )
              }
              right={() =>
                Platform.OS === "ios" && (
                  <RadioButton
                    color={colors.primary}
                    status={!isPublic ? "checked" : "unchecked"}
                    onPress={() => {
                      setPublic(false);
                    }}
                  />
                )
              }
            />
            <Divider />
          </View>
          <View>
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

const mapStateToProps = (state) => {
  const { account } = state;
  return {
    isInitialPublic: account.accountInfo?.user?.data?.public,
    state: account.state,
  };
};

export default connect(mapStateToProps)(VisibilityModal);
