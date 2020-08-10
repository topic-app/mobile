import React from "react";
import { ModalProps, State, ArticleListItem } from "@ts/types";
import {
  Divider,
  Button,
  HelperText,
  Card,
  ThemeProvider,
  useTheme,
} from "react-native-paper";
import { View, Platform, TextInput, Dimensions } from "react-native";
import { connect } from "react-redux";
import { BottomModal, SlideAnimation } from "react-native-modals";
import { logger } from "@utils/index";

import { CollapsibleView } from "@components/index";
import getStyles from "@styles/Styles";
import { addArticleList } from "@redux/actions/contentData/articles";
import getArticleStyles from "../styles/Styles";

type CreateModalProps = ModalProps & {
  lists: ArticleListItem[];
};

function CreateModal({ visible, setVisible, lists }: CreateModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [createListText, setCreateListText] = React.useState("");
  const [errorVisible, setErrorVisible] = React.useState(false);

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
            <Divider />

            <View style={articleStyles.activeCommentContainer}>
              <TextInput
                autoFocus
                placeholder="Nom de la liste"
                placeholderTextColor={colors.disabled}
                style={articleStyles.addListInput}
                value={createListText}
                onChangeText={(text) => {
                  setErrorVisible(false);
                  setCreateListText(text);
                }}
              />
              <CollapsibleView collapsed={!errorVisible}>
                <HelperText type="error" visible={errorVisible}>
                  Vous devez entrer un nom
                </HelperText>
              </CollapsibleView>
              <CollapsibleView
                collapsed={!lists.some((l) => l.name === createListText)}
              >
                <HelperText
                  type="error"
                  visible={lists.some((l) => l.name === createListText)}
                >
                  Une liste avec ce nom existe déjà
                </HelperText>
              </CollapsibleView>
            </View>
            <Divider />
            <View style={styles.contentContainer}>
              <Button
                mode={Platform.OS === "ios" ? "outlined" : "contained"}
                color={colors.primary}
                uppercase={Platform.OS !== "ios"}
                onPress={() => {
                  if (createListText === "") {
                    setErrorVisible(true);
                  } else if (!lists.some((l) => l.name === createListText)) {
                    // TODO: Add icon picker, or just remove the icon parameter and use a material design list icon
                    addArticleList(createListText);
                    setCreateListText("");
                    setVisible(false);
                  }
                }}
              >
                Créer la liste
              </Button>
            </View>
          </View>
        </Card>
      </ThemeProvider>
    </BottomModal>
  );
}

const mapStateToProps = (state: State) => {
  const { articleData } = state;
  return {
    lists: articleData.lists,
  };
};

export default connect(mapStateToProps)(CreateModal);
